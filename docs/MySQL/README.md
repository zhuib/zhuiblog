---
title: MySQL
date: 2020-12-11 11:15:53
permalink: /MySQL/
categories:
  - 数据库
tags:
  - MySQL
author: zhuib
---

## JOIN 使用

![alt text](./image.png)

### sql

```
create table `tbl_dept`(
 `id` int(11) not null auto_increment,
`deptName` varchar(30) default null,
`locAdd` varchar(40) default null,
primary key(`id`)
) engine=innodb auto_increment=1 default charset=utf8;

create table `tbl_emp`(
 `id` int(11) not null auto_increment,
`name` varchar(20) default null,
`deptId` int(11) default null,
primary key(`id`),
key `fk_dept_id`(deptId)
#constraint `fk_dept_id` foregin key(`deptId`) references `tbl_dept`(id)
) engine=innodb auto_increment=1 default charset=utf8;

insert into tbl_dept(deptName,locAdd) values('RD',11);
insert into tbl_dept(deptName,locAdd) values('HR',12);
insert into tbl_dept(deptName,locAdd) values('MK',13);
insert into tbl_dept(deptName,locAdd) values('MIS',14);
insert into tbl_dept(deptName,locAdd) values('FD',15);


insert into tbl_emp(Name,deptId) values('z3',1);
insert into tbl_emp(Name,deptId) values('z4',1);
insert into tbl_emp(Name,deptId) values('z5',1);

insert into tbl_emp(Name,deptId) values('w5',2);
insert into tbl_emp(Name,deptId) values('w6',2);


insert into tbl_emp(Name,deptId) values('s7',3);
insert into tbl_emp(Name,deptId) values('s8',4);
insert into tbl_emp(Name,deptId) values('s9',51);

```

##### inner join

![alt text](./image-1.png)

##### left join

![alt text](./image-2.png)

##### right join

![alt text](./image-3.png)

##### left join b on a.id = b.id where b.id is null

![alt text](./image-4.png)

##### right join b on a.id = b.id where a.id is null

![alt text](./image-5.png)

##### full outer join union

![alt text](./image-6.png)

##### inner join

![alt text](./image-7.png)
