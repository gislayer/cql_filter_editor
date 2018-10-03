

# cql_filter.js Library
## [DEMO Link](http://www.alikilic.org/cql_filter/)
Geoserver users often use the cql_filter parameter. You can use this library in your javascript codebase. It is convenient and easy a library. A good start for developers who want to improve.

![enter image description here](http://www.alikilic.org/cql_filter/cql_filter2.png)

# Libraries
 - [Jquery](https://jquery.com/) used for get values DOM
 - [json-viewer](https://www.jqueryscript.net/other/Beautiful-JSON-Viewer-Editor.html) for View json data
 - [jquery-tagsinput](https://www.jqueryscript.net/form/Tagging-Input-Bootstrap-4.html) for add multi values
 - [jquery.alertable](https://www.jqueryscript.net/demo/Nice-Clean-jQuery-Alert-Confirm-Dialog-Plugin-alertable-js/) for show the alerts
 - [Bootstrap 4](http://getbootstrap.com/) for Visual HTML

You may have information about libraries using  **links!**

## Using Library
**Basic Usage**

    var model = {id:{type:"integer"},name:{type:"string"},...};
    var  cqlFilter  =  new  cql_filter(model);
    cqlFilter.addCQLPart('id','=',[23124],'AND');
    cqlFilter.addCQLPart('name','!=',['Turkey'],'');
    var CQL_string = cqlFilter.getCql(cqlFilter.cqls,"");
    // id = 23124 AND name != 'Turkey'
**About Methods**

 - Class Name : **cql_filter**
	Parameter :   model | type : object
	Return : this
	About : This is Global Class Name
 
 - Method Name : **setModel**
	Parameter :   model | type : object
	Return : this
	About : Setting new DB Table Model to your *cql_filter* class
	
 - Method Name : **getModel**
	Parameter :   null
	Return : model | type : object
	About : Getting already exist DB Table Model at your *cql_filter* class
	
 - Method Name : **getOperators**
	Parameter :   type | string - [string, integer, float, boolean, date, polygon, polyline, point]
	Return : operators, type : *object Array*
	About : Getting cql_filter operators.  

 - Method Name : **getOperatorsByColumnName**
	Parameter :   ColumnName | string - [id, name, geoloc, etc]
	Return : operators, type : *object Array*
	About : Getting cql_filter operators.
	
 - Method Name : **getTypeByColumnName**
	Parameter :   ColumnName | string - [id, name, geoloc, etc]
	Return : Column Data Type , type : *string* 
	About : Getting Column's data type.
	
 - Method Name : **addCQLPart**
	Parameter :  id or time (integer)
	Return : this 
	About : for delete exist cql query.

 - Method Name : **deleteCQLPart**
	Parameter :   ColumnName:string, operator:string, values:array, andor:string, id or time (integer)
	Return : this 
	About : for add a new query.
	
 - Method Name : **getCQLString**
	Parameter :   null
	Return : cqlString - ID=1231 AND name LIKE '%ali%'
	About : for getting cql_filter string.
	
 - Method Name : **openParentheses**
	Parameter :   null
	Return : this
	About : Used to open parentheses

 - Method Name : **closeParentheses**
	Parameter :   null
	Return : this
	About : Used to close parentheses
	
 - Method Name : **getCQLArray**
	Parameter :   null
	Return : cql_array
	About : getting cql_array objects, columnName, operator, values, cql_string, time and "AND, OR",
	
**About Public Variable**
 - Method Name : **dataTypes**
	Return : object
	Data : [integer, string, float, boolean, date, point, polyline, polygon]
	
 - Method Name : **operators['dataType']**
	Return : object
	Data : [=, !=, LIKE %...%, LIKE %..., LIKE ...%, NOT LIKE %...%, NOT LIKE %..., NOT LIKE ...%, IN, NOT IN,  IS NULL, IS NOT NULL, <>, >, >=, <, <=, BETWEEN, NOT BETWEEN, BEFORE, AFTER]
	
 - Method Name : **Spatial Query Operators['dataType']**
	Return : object
	Data : [INTERSECTS, DISJOINT, CONTAINS, WITHIN, TOUCHES, CROSSES, OVERLAPS, EQUALS, RELATE, DWITHIN, BEYOND, BBOX]
## Some CQL Example
**Familiar Queries**

1. ID **=** 23091989
2. ID **!=** 2345
3. NAME **LIKE '%TURKEY%'**
4. NAME **LIKE '%TURK'** 
5. NAME **LIKE 'TURKEY%'** 
6. NAME **NOT LIKE '%TURKEY%'**
7. NAME **NOT LIKE '%TURK'** 
8. NAME **NOT LIKE 'TURKEY%'**
9. NAME  **IS NULL**
10. NAME **IS NOT NULL**
11. POPULATION **BETWEEN 12314 AND 12314**
12. POPULATION **NOT BETWEEN 12 AND 1000**
13. DATE **BEFORE** '23.09.1989'
14. DATE **AFTER** '23.09.1989'

**Spatial Queries**

1. **INTERSECTS**(geom, 'WKT STRING')
2. **DISJOINT**(geom, 'WKT STRING')
3. **CONTAINS**(geom, 'WKT STRING')
4. **WITHIN**(geom, 'WKT STRING')
5. **TOUCHES**(geom, 'WKT STRING')
6. **CROSSES**(geom, 'WKT STRING')
7. **OVERLAPS**(geom, 'WKT STRING')
8. **EQUALS**(geom, 'WKT STRING')
9. **RELATE**(geom1, geom2, relationType)
10. **DWITHIN**(geom, 'WKT STRING', distance, units)
11. **BEYOND**(geom, 'WKT STRING', distance, units)
12. **BBOX**(geom, y1, x1, y2, x2 )
> !!! You can change parameters between geoloc column and wkt string 

## Using

 1. Create your DB table model, like that : {**columnName**:{type:**dataType**},...}
 2. Use class **cql_filter** and user your model data at parameter 
 3. Add your query **cql_filter.addCQLPart( 'id', '=', [123], 'AND' )**
 4. if you have another query please do it
 5. Get your cql string .  **var myCqlString = cql_filter.getCQLString();**
## Some Links
 1. [My Portfolio](http://www.portfolio.alikilic.org)
 2. [My Blog](http://www.admin.alikilic.org/)

> Notice : If you know to use SQL, cql_filter syntax will be very easy for you.  
