---
title: 产品数据同步到 Elasticsearch 实现方案
date: 2025-05-20 11:15:53
permalink: /java/
categories:
  - 后端
tags:
  - Elasticsearch
author: zhuib
---


# 产品数据同步到 Elasticsearch 实现方案

## 1. 方案概述

该方案将包含以下几个部分：

*   **数据源：** 假设数据源是关系型数据库（例如 MySQL）。
*   **数据抽取：** 使用 JDBC 连接数据库，抽取产品数据。
*   **数据转换：** 将关系型数据转换为 Elasticsearch 可以接受的 JSON 格式。
*   **数据同步：** 使用 Elasticsearch 的 Java High Level REST Client 将数据写入 Elasticsearch。
*   **全量同步：** 从数据库全量读取数据，同步到 Elasticsearch。
*   **增量同步：** 监听数据库的变更（例如使用 Canal 中间件），实时同步数据到 Elasticsearch。
*   **错误处理：** 记录同步过程中的错误信息，方便排查问题。
*   **配置管理：** 将数据库连接信息、Elasticsearch 连接信息等配置信息外部化。

## 2. 技术选型

*   **Java:** 编程语言。
*   **JDBC:** 用于连接关系型数据库。
*   **Elasticsearch Java High Level REST Client:** 用于操作 Elasticsearch。
*   **Canal:** 用于监听 MySQL 数据库的变更（增量同步）。
*   **Maven:** 项目构建工具。
*   **Slf4j + Logback:** 日志框架。
*   **Jackson/Gson:** JSON 处理库。

## 3. 实现步骤

### 3.1. 准备工作

*   安装 MySQL 数据库，并创建产品表（例如 `product`）。
*   安装 Elasticsearch。
*   安装 Canal（如果需要增量同步）。
*   安装 Maven。
*   在您的机器上创建 `/Users/huib/work` 目录，确保有写入权限。

### 3.2. 创建 Maven 项目

创建一个 Maven 项目，并添加以下依赖：

```xml
<dependencies>
    <!-- JDBC driver -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>

    <!-- Elasticsearch Client -->
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.17.17</version>
    </dependency>

    <dependency>
        <groupId>org.elasticsearch</groupId>
        <artifactId>elasticsearch</artifactId>
        <version>7.17.17</version>
    </dependency>

    <!-- Canal Client -->
    <dependency>
        <groupId>com.alibaba.otter</groupId>
        <artifactId>canal.client</artifactId>
        <version>1.1.6</version>
    </dependency>

    <!-- JSON -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.13.0</version>
    </dependency>

    <!-- Logging -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.32</version>
    </dependency>
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.6</version>
    </dependency>
</dependencies>
```

### 3.3. 编写 Java 代码

```java
import com.alibaba.otter.canal.client.CanalConnector;
import com.alibaba.otter.canal.client.CanalConnectors;
import com.alibaba.otter.canal.common.utils.AddressUtils;
import com.alibaba.otter.canal.protocol.CanalEntry;
import com.alibaba.otter.canal.protocol.Message;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpHost;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductSync {

    private static final Logger logger = LoggerFactory.getLogger(ProductSync.class);

    private static final String MYSQL_HOST = "localhost";
    private static final int MYSQL_PORT = 3306;
    private static final String MYSQL_USERNAME = "root";
    private static final String MYSQL_PASSWORD = "password";
    private static final String MYSQL_DATABASE = "test";
    private static final String MYSQL_TABLE = "product";

    private static final String ES_HOST = "localhost";
    private static final int ES_PORT = 9200;
    private static final String ES_INDEX = "product_index";

    public static void main(String[] args) throws IOException {
        // 全量同步
        fullSync();

        // 增量同步 (需要 Canal 支持)
        incrementSync();

        System.out.println("同步完成，请查看 /Users/huib/work/sync_to_es.md 文件");
    }

    // 全量同步
    public static void fullSync() throws IOException {
        logger.info("开始全量同步...");

        List<Map<String, Object>> products = getAllProductsFromDatabase();

        RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(new HttpHost(ES_HOST, ES_PORT, "http")));

        BulkRequest bulkRequest = new BulkRequest();
        ObjectMapper mapper = new ObjectMapper();

        for (Map<String, Object> product : products) {
            try {
                String jsonString = mapper.writeValueAsString(product);
                IndexRequest indexRequest = new IndexRequest(ES_INDEX)
                        .source(jsonString, XContentType.JSON);
                bulkRequest.add(indexRequest);
            } catch (Exception e) {
                logger.error("Failed to convert product to JSON: {}", product, e);
            }
        }

        try {
            BulkResponse bulkResponse = client.bulk(bulkRequest, RequestOptions.DEFAULT);
            if (bulkResponse.hasFailures()) {
                logger.error("Bulk index failed: {}", bulkResponse.buildFailureMessage());
            } else {
                logger.info("全量同步成功，同步 {} 条数据", products.size());
            }
        } catch (IOException e) {
            logger.error("Failed to bulk index to Elasticsearch", e);
        } finally {
            client.close();
        }

        logger.info("全量同步完成.");
        writeToFile("/Users/huib/work/sync_to_es.md", "全量同步完成，同步 " + products.size() + " 条数据\n");
    }

    // 从数据库获取所有产品
    private static List<Map<String, Object>> getAllProductsFromDatabase() {
        List<Map<String, Object>> products = new ArrayList<>();
        String url = "jdbc:mysql://" + MYSQL_HOST + ":" + MYSQL_PORT + "/" + MYSQL_DATABASE + "?serverTimezone=UTC";

        try (Connection connection = DriverManager.getConnection(url, MYSQL_USERNAME, MYSQL_PASSWORD);
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT * FROM " + MYSQL_TABLE)) {

            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            while (resultSet.next()) {
                Map<String, Object> product = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    product.put(metaData.getColumnName(i), resultSet.getObject(i));
                }
                products.add(product);
            }

        } catch (SQLException e) {
            logger.error("Failed to get products from database", e);
        }

        return products;
    }


    // 增量同步（使用 Canal）
    public static void incrementSync() {
        logger.info("开始增量同步...");

        // 配置 Canal
        String destination = "example"; // Canal instance name
        String canalServerHost = AddressUtils.getHostAddress();
        CanalConnector connector = CanalConnectors.newSingleConnector(
                new java.net.InetSocketAddress(canalServerHost, 11111), destination, MYSQL_USERNAME, MYSQL_PASSWORD);

        int batchSize = 1000;

        try {
            connector.connect();
            connector.subscribe(".*\." + MYSQL_TABLE); // 订阅所有数据库中指定表的变化
            connector.rollback();

            while (true) {
                Message message = connector.getWithoutAck(batchSize); // 获取指定数量的数据
                long batchId = message.getId();
                int size = message.getEntries().size();
                if (batchId == -1 || size == 0) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    continue;
                }

                processCanalEntries(message.getEntries());

                connector.ack(batchId); // 提交确认
            }

        } catch (Exception e) {
            logger.error("增量同步出错", e);
            connector.rollback();
        } finally {
            connector.disconnect();
        }
    }

    private static void processCanalEntries(List<CanalEntry.Entry> entryList) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(new HttpHost(ES_HOST, ES_PORT, "http")));
        ObjectMapper mapper = new ObjectMapper();
        BulkRequest bulkRequest = new BulkRequest();

        for (CanalEntry.Entry entry : entryList) {
            if (entry.getEntryType() == CanalEntry.EntryType.TRANSACTIONBEGIN || entry.getEntryType() == CanalEntry.EntryType.TRANSACTIONEND) {
                continue;
            }

            if (entry.getEntryType() == CanalEntry.EntryType.ROWDATA) {
                CanalEntry.RowChange rowChange = null;
                try {
                    rowChange = CanalEntry.RowChange.parseFrom(entry.getStoreValue());
                } catch (Exception e) {
                    throw new RuntimeException("ERROR ## parser of eromanga-event has an error , data:" + entry.toString(),
                            e);
                }

                CanalEntry.EventType eventType = rowChange.getEventType();
                for (CanalEntry.RowData rowData : rowChange.getRowDatasList()) {
                    try {
                        Map<String, Object> dataMap = new HashMap<>();

                        if (eventType == CanalEntry.EventType.DELETE) {
                            //TODO: Delete operation on ES
                            List<CanalEntry.Column> columns = rowData.getBeforeColumnsList();
                            for(CanalEntry.Column column: columns){
                                dataMap.put(column.getName(), column.getValue());
                            }
                        } else if (eventType == CanalEntry.EventType.INSERT || eventType == CanalEntry.EventType.UPDATE) {
                            List<CanalEntry.Column> columns = rowData.getAfterColumnsList();
                            for(CanalEntry.Column column: columns){
                                dataMap.put(column.getName(), column.getValue());
                            }
                            String jsonString = mapper.writeValueAsString(dataMap);
                            IndexRequest indexRequest = new IndexRequest(ES_INDEX)
                                    .source(jsonString, XContentType.JSON);
                            bulkRequest.add(indexRequest);
                        }
                    }catch (Exception e){
                        logger.error("ERROR ## parser of row data has an error , data:" + rowData.toString(), e);
                    }
                }
            }
        }
        try {
            BulkResponse bulkResponse = client.bulk(bulkRequest, RequestOptions.DEFAULT);
            if (bulkResponse.hasFailures()) {
                logger.error("Bulk index failed: {}", bulkResponse.buildFailureMessage());
            } else {
                logger.info("增量同步成功，同步 {} 条数据", entryList.size());
                writeToFile("/Users/huib/work/sync_to_es.md", "增量同步成功，同步 " + entryList.size() + " 条数据\n");
            }
        } catch (IOException e) {
            logger.error("Failed to bulk index to Elasticsearch", e);
        } finally {
            client.close();
        }
    }


    private static void writeToFile(String filePath, String content) {
        try {
            Files.write(Paths.get(filePath), content.getBytes());
        } catch (IOException e) {
            logger.error("写入文件失败", e);
        }
    }
}
```

### 4.  运行

1.  **配置 Canal:**  确保Canal server启动，并且正确配置了MySQL的binlog同步。
2.  **修改配置:**  修改代码中的数据库连接信息、Elasticsearch 连接信息和 Canal 相关配置。
3.  **创建 MySQL 表:**
    ```sql
    CREATE TABLE `product` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `name` varchar(255) DEFAULT NULL,
      `price` decimal(10,2) DEFAULT NULL,
      `description` text,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    ```
4.  **运行程序:**  使用 Maven 运行程序：`mvn clean install exec:java -Dexec.mainClass="ProductSync"`

### 5.  结果验证

程序运行完成后，查看 `/Users/huib/work/sync_to_es.md` 文件，确认同步结果。

同时，可以使用 Elasticsearch 的 API 验证数据是否成功同步到 Elasticsearch。

**注意：**

*   该示例代码仅为演示目的，实际生产环境需要进行优化，例如连接池管理、更完善的错误处理等。
*   增量同步需要 Canal 的支持，需要正确配置 Canal 才能正常工作。
*   请根据实际情况修改代码中的配置信息。
*   确保您的机器上安装了 MySQL、Elasticsearch 和 Canal。
