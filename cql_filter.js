var cqlFilter = null;

class cql_filter{

    constructor(model){
        var self = this;
        this.model = model || {};
        this.cqls = [];
        this.cql = '';
        this.operators = {
            'string':['=','!=','LIKE %...%','LIKE %...','LIKE ...%','NOT LIKE %...%','NOT LIKE %...','NOT LIKE ...%','IN','NOT IN','IS NULL','IS NOT NULL'],
            'integer':['=','!=','<>','>','>=','<','<=','BETWEEN','NOT BETWEEN','IN','NOT IN','IS NULL','IS NOT NULL'],
            'float':['=','!=','<>','>','>=','<','<=','BETWEEN','NOT BETWEEN','IN','NOT IN','IS NULL','IS NOT NULL'],
            'boolean':['=','!=','IS NULL','IS NOT NULL'],
            'date':['=','!=','>','>=','<','<=','BETWEEN','NOT BETWEEN','IN','NOT IN','BEFORE','AFTER','IS NULL','IS NOT NULL'],
            'polygon':['INTERSECTS','DISJOINT','CONTAINS','WITHIN','TOUCHES','CROSSES','OVERLAPS','EQUALS','RELATE','DWITHIN','BEYOND','BBOX'],
            'polyline':['INTERSECTS','DISJOINT','CONTAINS','WITHIN','TOUCHES','CROSSES','OVERLAPS','EQUALS','RELATE','DWITHIN','BEYOND','BBOX'],
            'point':['INTERSECTS','DISJOINT','CONTAINS','WITHIN','TOUCHES','CROSSES','OVERLAPS','EQUALS','RELATE','DWITHIN','BEYOND','BBOX']
        };
        this.operatorValues = {
            empty:['IS NULL','IS NOT NULL'],
            single:['=','!=','LIKE %...%','LIKE %...','LIKE ...%','NOT LIKE %...%','NOT LIKE %...','NOT LIKE ...%','<>','>','>=','<','<=','BEFORE','AFTER'],
            double:['BETWEEN','NOT BETWEEN','INTERSECTS','DISJOINT','CONTAINS','WITHIN','TOUCHES','CROSSES','OVERLAPS','EQUALS'],
            triple:['RELATE'],
            quaters:['BBOX','BEYOND','DWITHIN'],
            multi:['IN','NOT IN']
        };
        this.justDoubleSpatial = ['INTERSECTS','DISJOINT','CONTAINS','WITHIN','TOUCHES','CROSSES','OVERLAPS','EQUALS'];
        this.units = ['feet','meters','statute miles','nautical miles','kilometers'];
        this.dataTypes = ["integer","string","float","boolean","date","point","polyline","polygon"];
        this.parantheseIndex = 0;
        this.errors = {
            differentType:function(a){ return 'Your Column type and value is not same type: Please use only '+a+' values'},
            weCantConvert : "Sorry, we couldn't fix the data type",
            exType : function(a){return 'This ('+a+') column name doesn\'t exist in Your Database Table Model'},
            exType2 : function(a){return 'This ('+a+') data type doesn\'t exist in Table Model'},
            datTypes : function(a){return 'This ('+a+') data type doesn\'t exist. Use this data set => '+self.dataTypes.join(', ');},
            smilarValue:"Please never use smilar value for Spatial Query operators"
        };
    }

    removeCQL(time){

    }

    getCQLArray(){
        return this.cqls;
    }

    closeParentheses(){
        this.parantheseIndex-=1;
        if(this.parantheseIndex<0){
            this.parantheseIndex=0;
        }
        return this;
    }

    openParentheses(){
        debugger;
        var dizi = this.cqls;
        for(var i=0;i<=this.parantheseIndex;i++){
            if(i==this.parantheseIndex){
                dizi.push([]);
            }else{
                var son = dizi.length-1;
                dizi = dizi[son];
            }
        }
        this.parantheseIndex++;
        return this;
    }

    getValueSettings(operator){
        var durum = false;
        for(var i in this.operatorValues){
            if(this.operatorValues[i].indexOf(operator)!==-1){
                durum=i;
                break;
            }
        }
        return durum;
    }

    getHTMLCQLString(dizi,cqlstring){
        var cql = this.getCql(this.cqls,"");
        var forAnd = cql.substr(cql.length-4);
        var son = '';
        if(forAnd=="AND "){
            cql = cql.substr(0, cql.length-4);
            son+='<span style="color:#43d255; opacity: 0.3;"> AND</span>';
        }
        var forOr = cql.substr(cql.length-3);
        if(forOr=="OR "){
            cql = cql.substr(0, cql.length-3);
            son+='<span style="color:#43d255; opacity: 0.3;"> OR</span>';
        }
        return cql+son;
    }

    getCqlStringClear(){
        var cql = this.getCql(this.cqls,"");
        var forAnd = cql.substr(cql.length-4);
        var son = '';
        if(forAnd=="AND "){
            cql = cql.substr(0, cql.length-4);
        }
        var forOr = cql.substr(cql.length-3);
        if(forOr=="OR "){
            cql = cql.substr(0, cql.length-3);
        }
        return cql;
    }

    getCQLString(){
        var arr = this.cqls;
        return this.getCql(arr,"");
    }

    getCql(dizi,cqlstring){
        debugger;
        for(var z=0;z<dizi.length;z++){
            var part = dizi[z];
            if(typeof part.length=="number"){
                var arapart = "";
                
                arapart +=this.getCql(part,arapart);
                arapart='( '+arapart+') ';
                cqlstring+=arapart;
            }else{
                cqlstring+=''+part.cqlpart+' '+part.method+' ';
            }
        }
        while(cqlstring.indexOf('OR )')!==-1){
            cqlstring = cqlstring.replace('OR )',') OR');
        }

        while(cqlstring.indexOf('AND )')!==-1){
            cqlstring = cqlstring.replace('AND )',') AND');
        }

        return cqlstring;
    }

    callbackCQL(){

    }

    

    addCQLPart(columnName,operator,values,andor){
        debugger;
        var oprtrs = this.getOperatorsByColumnName(columnName);
        var type = this.getTypeByColumnName(columnName);
        if(['IS NULL','IS NOT NULL'].indexOf(operator)==-1){
            values = this.convertWrongData(type,values,operator,columnName);
        }
        

        var part = {};
        var time = Date.now();
        if(this.operatorValues.single.indexOf(operator)!==-1){
            part = this.singleCqlPart(columnName,operator,values[0],andor,time);
        }
        else if(this.operatorValues.double.indexOf(operator)!==-1){
            part = this.doubleCqlPart(columnName,operator,[values[0],values[1]],andor,time);
        }
        else if(this.operatorValues.multi.indexOf(operator)!==-1){
            part = this.multiCqlPart(columnName,operator,values,andor,time);
        }
        else if(this.operatorValues.empty.indexOf(operator)!==-1){
            part = this.emptyCqlPart(columnName,operator,andor,time);
        }
        else if(this.operatorValues.quaters.indexOf(operator)!==-1){
            part = this.quaterCqlPart(columnName,operator,values,andor,time);
        }
        else if(this.operatorValues.triple.indexOf(operator)!==-1){
            part = this.tripleCqlPart(columnName,operator,values,andor,time);
        }
        else{
            part=false;
        }
        debugger;
        var dizi = this.cqls;
        for(var i=0;i<=this.parantheseIndex;i++){
            if(i==this.parantheseIndex){
                dizi.push(part);
            }else{
                var son = dizi.length-1;
                dizi = dizi[son];
            }
        }
        return this;
    }

    floatControl(value){
        var status = false;
        var result = value;
        if(this.isFloat(value)){
            status=true;
        }else if(!Number.isNaN(parseFloat(value,10))){
            status=true;
            result = parseFloat(value);
        }
        return {status:status,result:result};
    }

    intControl(value){
        var status = false;
        var result = value;
        if(Number.isInteger(value)){
            status=true;
        }else if(!Number.isNaN(parseInt(value,10))){
            result = parseInt(value);
        }
        return {status:status,result:result};
    }

    convertWrongData(type,values,operator,columnName){
        var self = this;
        var valueExport = false;
        if(typeof values=="object"){
            valueExport=[];
            values.map(function(value,i){
                switch(type){
                    case "string":
                        valueExport.push(""+value);
                        break;
                    case "date":
                        valueExport.push(""+value);
                        break;
                    case "integer":
                        if(Number.isInteger(value)){
                            valueExport.push(value);
                        }else if(!Number.isNaN(parseInt(value,10))){
                            valueExport.push(parseInt(value,10));
                        }else{
                            $.alertable.alert(self.errors.differentType("integer"));
                            throw new Error(self.errors.differentType("integer"));
                        }
                        break;
                    case "float":
                        if(self.isFloat(value)){
                            valueExport.push(value);
                        }else if(!Number.isNaN(parseFloat(value,10))){
                            valueExport.push(parseFloat(value,10));
                        }else{
                            $.alertable.alert(self.errors.differentType("float or integer"));
                            throw new Error(self.errors.differentType("float or integer"));
                        }
                        break;
                    case "boolean":
                        if(typeof value == 'boolean'){
                            valueExport.push(value);
                        }else if(typeof value == 'string'){
                            if(["true","TRUE","True","1"].indexOf(value)!==-1){
                                value=true;
                                valueExport.push(value);
                            }
                            else if(["false","FALSE","False","0"].indexOf(value)!==-1){
                                value=false;
                                valueExport.push(value);
                            }else{
                                $.alertable.alert(self.errors.differentType("boolean"));
                            throw new Error(self.errors.differentType("boolean"));
                            }
                        }else{
                            $.alertable.alert(self.errors.differentType("boolean"));
                            throw new Error(self.errors.differentType("boolean"));
                        }
                        break;
                    case "polygon":
                        valueExport.push(""+value);
                        break;
                    case "polyline":
                        valueExport.push(""+value);
                        break;
                    case "point":
                        valueExport.push(""+value);
                        break;
                        
                }
            });
        }
        if(valueExport==false){
            $.alertable.alert(self.errors.weCantConvert);
            throw new Error(this.errors.weCantConvert);
        }else{
            var val2 = [];
            if(this.operatorValues.quaters.indexOf(operator)!==-1){
                if(operator=="BBOX"){
                    valueExport.map(function(val){
                        var valctrl = self.floatControl(val);
                        if(valctrl.status){
                            val2.push(valctrl.result);
                        }else{
                            $.alertable.alert(self.errors.differentType("float or integer"));
                            throw new Error(self.errors.differentType("float or integer"));
                        }
                        
                    });
                }else if(operator=="BEYOND" || operator=="DWITHIN"){
                    if(columnName!==valueExport[0]){
                        val2[0]="'"+valueExport[0]+"'";
                    }else{
                        val2[0]=valueExport[0];
                    }
                    if(columnName!==valueExport[1]){
                        val2[1]="'"+valueExport[1]+"'";
                    }else{
                        val2[1]=valueExport[1];
                    }
                    var v3ctrl = this.floatControl(valueExport[2]);
                    var status = true;
                    if(v3ctrl.status){
                        val2[2] = v3ctrl.result;
                    }else{
                        status=false;
                    }
                    if(this.units.indexOf(valueExport[3])!==-1){
                        val2[3]="'"+valueExport[3]+"'";
                    }else{
                        val2[3]="'meters'";
                    }
                    if(val2[1]==val2[0]){
                        $.alertable.alert(self.errors.smilarValue);
                        throw new Error(self.errors.smilarValue);
                    }
                }
            }else if(this.justDoubleSpatial.indexOf(operator)!==-1){
                if(columnName!==valueExport[0]){
                    val2[0]="'"+valueExport[0]+"'";
                }else{
                    val2[0]=valueExport[0];
                }
                if(columnName!==valueExport[1]){
                    val2[1]="'"+valueExport[1]+"'";
                }else{
                    val2[1]=valueExport[1];
                }

                if(val2[1]==val2[0]){
                    $.alertable.alert(self.errors.smilarValue);
                    throw new Error(self.errors.smilarValue);
                }

            }else if(this.operatorValues.triple.indexOf(operator)!==-1){
                if(columnName!==valueExport[0]){
                    val2[0]="'"+valueExport[0]+"'";
                }else{
                    val2[0]=valueExport[0];
                }
                if(columnName!==valueExport[1]){
                    val2[1]="'"+valueExport[1]+"'";
                }else{
                    val2[1]=valueExport[1];
                }

                val2[2] = "'"+valueExport[2]+"'";

                if(val2[1]==val2[0]){
                    $.alertable.alert(self.errors.smilarValue);
                    throw new Error(self.errors.smilarValue);
                }

            }else{
                valueExport.map(function(val){
                    if(typeof val =="string"){
                        val2.push("'"+val+"'");
                    }else{
                        val2.push(val);
                    }
                });
            }
            
            valueExport = val2;
            return valueExport;
        }
    }

    isFloat(n){
        return Number(n) === n && n % 1 !== 0;
    }

    quaterCqlPart(columnName,operator,values,andor,time){
        var part = {};
        switch(operator){
            case 'BBOX':
            part = {column:columnName,operator:operator,values:values,cqlpart:'BBOX('+columnName+','+values.toString()+')',method:andor,time:time};
            break;  
            case 'BEYOND':
            part = {column:columnName,operator:operator,values:values,cqlpart:'BEYOND('+values.toString()+')',method:andor,time:time};
            break;
            case 'DWITHIN':
            part = {column:columnName,operator:operator,values:values,cqlpart:'DWITHIN('+values.toString()+')',method:andor,time:time};
            break;  
        }
        return part
    }

    tripleCqlPart(columnName,operator,values,andor,time){
        var part = {};

        if(this.operatorValues.triple.indexOf()){}
        switch(operator){
            case 'RELATE':
                part = {column:columnName,operator:operator,values:values,cqlpart:'RELATE('+values.toString()+')',method:andor,time:time};
            break;    
        }
        return part
    }

    emptyCqlPart(columnName,operator,andor,time){
        return {column:columnName,operator:operator,values:"",cqlpart:columnName+' '+operator,method:andor,time:time};
    }

    multiCqlPart(columnName,operator,values,andor,time){
        debugger;
        if(values.length>0){
            return {column:columnName,operator:operator,values:values,cqlpart:columnName+' '+operator+' ('+values.toString()+')',method:andor,time:time};
        }else{
            return false;
        }
    }

    doubleCqlPart(columnName,operator,values,andor,time){
        if(['BETWEEN','NOT BETWEEN'].indexOf(operator)!==-1){
            return {column:columnName,operator:operator,values:values,cqlpart:columnName+' '+operator+' '+values[0]+' AND '+values[1],method:andor};
        }else{
            return {column:columnName,operator:operator,values:values,cqlpart:operator+'('+values[0]+','+values[1]+')',method:andor,time:time};
        }
    }

    singleCqlPart(columnName,operator,value,andor,time){
        var opt = ['LIKE %...%','LIKE %...','LIKE ...%','NOT LIKE %...%','NOT LIKE %...','NOT LIKE ...%'];
        var txt = columnName+' '+operator+' '+value;
        if(opt.indexOf(operator)!==-1){
            if(typeof value =="string"){
               value = value.substring(1, value.length-1);
            }
        }
        switch(operator){
            case "LIKE %...%":
            txt=columnName+" LIKE '%"+value+"%'";
            break;
            case "LIKE %...":
            txt=columnName+" LIKE '%"+value+"'";
            break;
            case "LIKE ...%":
            txt=columnName+" LIKE '"+value+"%'";
            break;
            case "NOT LIKE %...%":
            txt=columnName+" NOT LIKE '%"+value+"%'";
            break;
            case "NOT LIKE %...":
            txt=columnName+" NOT LIKE '%"+value+"'";
            break;
            case "NOT LIKE ...%":
            txt=columnName+" NOT LIKE '"+value+"%'";
            break;
        }
        return {column:columnName,operator:operator,values:value,cqlpart:txt,method:andor,time:time};
    }

    getTypeByColumnName(name){
        if(typeof this.model[name]!=="undefined"){
            return this.model[name].type;
        }else{
            $.alertable.alert(this.errors.exType(name));
            throw new Error(this.errors.exType(name));
            return false;
        }
    }

    

    getOperatorsByColumnName(name){
        if(typeof this.model[name]!=="undefined"){
            return this.getOperators(this.model[name].type);
        }else{
            $.alertable.alert(this.errors.exType(name));
            throw new Error(this.errors.exType(name));
            return false;
        }
    }

    getOperators(type){
        if(this.dataTypes.indexOf(type)!==-1){
            if(typeof this.operators[type]!=="undefined"){
                return this.operators[type];
            }else{
                $.alertable.alert(this.errors.exType2(type));
                throw new Error(this.errors.exType2(type));
                return false;
            }
        }else{
            //$.alertable.alert(this.errors.datTypes(model[a].type));
            throw new Error(this.errors.datTypes(model[a].type));
            return false;
        }
    }

    getModel(){
        return this.model;
    }

    setModel(model){
        var ix=0;
        for(var a in model){
            ix++;
            if(this.dataTypes.indexOf(model[a].type)==-1){
                //$.alertable.alert(this.errors.datTypes(model[a].type));
                throw new Error(this.errors.datTypes(model[a].type));
                return false;
            }
        }
        if(ix>0){
            this.model = model;
        }else{
            this.model={};
        }
        return this;
    }
}

var cqlFilter = new cql_filter(model);
