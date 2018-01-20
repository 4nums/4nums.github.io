// this js is for chartnew.js
function tofix1(a, precision)
{
    for (ii = 0; ii < a.length; ii ++)
        a[ii] = a[ii].toFixed(precision);
    return a;
}
  
function split_array(a)
{    var b = [];
    for (ii = 0; ii < a.length; ii +=2)
    {
        b.push(a[ii]);
        }
        for (ii = 1; ii < a.length; ii +=2)
    {
        b.push(a[ii]);
        }
        return b;
} 
 
 function deviationValue(params) {
	var data = params.data;
	var datasetNr = params.datasetNr;
	return(data.datasets[datasetNr].deviationValue);
 }

function data_line_errorbar(data_vec,num_shown,boundary_vec, errorbar_vec)
{
     var mydata = {labels:[], datasets:[{fillColor:[], strokeColor:[], data:[], inGraphDataShow:[],deviationValue:[], drawMathDeviation: "deviationValue", deviationWidth: 0}]}
     for (ii = 0; ii < num_shown; ii++)
    {
        mydata.labels[ii] = ' ';
        mydata.datasets[0].data[ii] = data_vec[ii];  
        mydata.datasets[0]. fillColor[ii] = "rgba(255,255,255,0.1)";      
        mydata.datasets[0]. strokeColor[ii] = "rgba( 170,170,170,1)";   
        mydata.datasets[0].inGraphDataShow[ii] =0;
         mydata.datasets[0].deviationValue[ii] =errorbar_vec[ii];
 
    } 
    return mydata;
}
function data_line (data_vec,num_shown,boundary_vec)
{
     var mydata = {labels:[], datasets:[{fillColor:[], strokeColor:[], data:[], inGraphDataShow:[]}]}
     for (ii = 0; ii < num_shown; ii++)
    {
        mydata.labels[ii] = ' ';
        mydata.datasets[0].data[ii] = data_vec[ii];  
        mydata.datasets[0]. fillColor[ii] = "rgba(255,255,255,0.1)";      
        mydata.datasets[0]. strokeColor[ii] = "rgba( 170,170,170,1)";   
        mydata.datasets[0].inGraphDataShow[ii] =0;
 
    } 
    return mydata;
}
function assigncolor1(area,ctx,data,statData,posi,posj,othervars)
{ 
    var colorarray = [0,0,0];
   var boundary_vec =  [5.5, 35.5,200];
  if(posi==0)
  {
      var a = 1*data.datasets[posi].data[posj];
      if (a < boundary_vec[1]){  
   	    colorarray =  color_array(Math.log(a), Math.log(boundary_vec[0]), Math.log(boundary_vec[1]), [0,255,0], [255,255,0]);
        }else{
   	colorarray =  color_array(Math.log(a), Math.log(boundary_vec[1]), Math.log(boundary_vec[2]), [255,255,0], [255,0,0]);}
    }  
     return ("rgba(" + colorarray[0]+","+colorarray[1]+","+colorarray[2]+",1)");
}
 
   
function data_bar(data_vec,num_shown, boundary_vec)
{
    

    var mydata = {labels:[], datasets:[{fillColor:[], strokeColor:[], data:[],     inGraphDataFontColor:[],inGraphDataShow:[]}]}
    var colorarray=[0,0,0]; 
    for (ii = 0; ii < num_shown; ii++)
    {
        mydata.labels[ii] = ' ';
        mydata.datasets[0].data[ii] = data_vec[ii];  
        if (data_vec[ii] < boundary_vec[1]){  
   	    colorarray =  color_array(Math.log(data_vec[ii]), Math.log(boundary_vec[0]), Math.log(boundary_vec[1]), [0,255,0], [255,255,0]);
        }
   	else{
   	colorarray =  color_array(Math.log(data_vec[ii]), Math.log(boundary_vec[1]), Math.log(boundary_vec[2]), [255,255,0], [255,0,0]);}
        mydata.datasets[0]. fillColor[ii] =  "rgba(" + colorarray[0]+","+colorarray[1]+","+colorarray[2]+",1)";
        mydata.datasets[0]. strokeColor[ii] = "rgba( 170,170,170,1)";  
        mydata.datasets[0]. pointColor = "rgba( 1,7,5,1)";
        mydata.datasets[0]. pointStrokeColor = "rgba( 1,7,5,1)";
        mydata.datasets[0].inGraphDataShow[ii] =0;
          mydata.datasets[0].inGraphDataFontColor[ii] = "black" ;

    } 
    mydata.datasets[0]. strokeColor[num_shown-1] = "rgba( 0, 0, 0,1)";  
    return mydata;
}

function assigncolor(area,ctx,data,statData,posi,posj,othervars)
{ 
  if(posi==0 && 1*data.datasets[posi].data[posj]<35.5) return("BLUE");
  else return("RED");
}

function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}
function pm25_color(pm25)
{
 if (pm25< 35.5){  
   	    colorarray =  color_array(Math.log(pm25), Math.log(5.5), Math.log(35.5), [0,255,0], [255,255,0]);
        }
   	else{
   	colorarray =  color_array(Math.log(pm25), Math.log(35.5), Math.log(200), [255,255,0], [255,0,0]);}
    return "#"+toHex(colorarray[0])+toHex(colorarray[1])+toHex(colorarray[2]);
} 

function color_array(val, lower_val, upper_val, lower_rgb, upper_rgb)
{
	var ii;
	if (val >= upper_val)
	  return upper_rgb;
	var ratio = Math.log(val / lower_val) /Math.log (upper_val / lower_val);
	var res = [0,0,0];
	for (ii = 0; ii < 3; ii ++)
	{
		res[ii] = Math.round(lower_rgb[ii] *(1- ratio) +  upper_rgb[ii]*ratio); 
	}
	return res;

}
function linear_inter (Ohigh, Olow, Ihigh, Ilow, I)
{

    a=Math.round( (I-Ilow)/(Ihigh-Ilow)*(Ohigh-Olow)+Olow );
    return a;
}
function PM25_to_AQI ( pm25 )
{
     if (pm25 <12){
        return linear_inter(50,0,12,0,pm25);}
    else if (pm25 <35.5){
        return linear_inter(100,51,35.4,12.1,pm25);}
    else if ( pm25 <55.5){
        return linear_inter(150,101,55.4,35.5,pm25);}
    else if ( pm25 <150.5){
        return linear_inter(200,151,150.4,55.5,pm25);}
    else if ( pm25 <250.5){
        return linear_inter(300,201,250.4,150.5,pm25);}
    else if ( pm25 <350.5){
        return linear_inter(400,301,350.4,250.5,pm25);}
    else if ( pm25 <500){
        return linear_inter(500,401,500.4,350.5,pm25);}
    else{
        return 500;}
}

function PM25_to_AQICN ( pm25 )
{
     if (pm25 <35){
        return linear_inter(50,0,35,0,pm25);}
    else if (pm25 <75.5){
        return linear_inter(100,51,75.4,35.1,pm25);}
    else if ( pm25 <115.5){
        return linear_inter(150,101,115.4,75.5,pm25);}
    else if ( pm25 <150.5){
        return linear_inter(200,151,150.4,115.5,pm25);}
    else if ( pm25 <250.5){
        return linear_inter(300,201,250.4,150.5,pm25);}
    else if ( pm25 <350.5){
        return linear_inter(400,301,350.4,250.5,pm25);}
    else if ( pm25 <500){
        return linear_inter(500,401,500.4,350.5,pm25);}
    else{
        return 500;}
}
function aqilevel_words(level)
{
if (level ==0){
        return "好, 大口吸";}
    else if (level ==1){
        return "中等, 吸";}
    else if ( level ==2){
        return "不适于敏感人群, 悠着吸";}
    else if ( level ==3){
        return "不健康, 尽量别吸";}
    else if ( level ==4){
        return "很不健康, 别吸";}
    else{
        return "我去, 别出门";}
}
function aqilevel_color(level)
{
if (level ==0){
        return " #00e400";}
    else if (level ==1){
        return "#ff0";}
    else if ( level ==2){
        return "#ff7e00";}
    else if ( level ==3){
        return "#f00";}
    else if ( level ==4){
        return "#99004c";}
    else{
        return "#7e0023";}
}

function aqi_level(pm25)
{
   if (pm25 <12){
        return 0;}
    else if (pm25 <35.5){
        return 1;}
    else if ( pm25 <55.5){
        return 2;}
    else if ( pm25 <150.5){
        return 3;}
    else if ( pm25 <250.5){
        return 4;}
    else{
        return 5;}
}

function aqi_levelcn(pm25)
{
   if (pm25 <35){
        return 0;}
    else if (pm25 <75.5){
        return 1;}
    else if ( pm25 <115.5){
        return 2;}
    else if ( pm25 <150.5){
        return 3;}
    else if ( pm25 <250.5){
        return 4;}
    else{
        return 5;}
}

function fillhole(seq)
{    
   var res = seq.slice();
     var ii = 0;
    var jj, kk; 
    while (ii < seq.length)
    {
        if (seq[ii] > 0)
        {    
		ii =ii+ 1;
	 }
        else{
             jj = ii+1;
            while (jj < seq.length && seq[jj]==0){
                jj =jj+ 1;}
            if (ii == 0){
                     for (kk =ii; kk < jj; kk ++){
                    res[kk] =  res[jj] ;
			} 
		}
            else if( jj == seq.length){
                                    for (kk =ii; kk < jj; kk ++){
                    res[kk] =  res[ii-1] ;
			} 
            }
            else{
			
                for (kk =ii; kk < jj; kk ++){
                    res[kk] =  res[ii-1] + (res[jj]-res[ii-1]) *(kk-ii+1)/(jj-ii+1 );
			}
		}
            ii = jj;
	   }
	}
    return res;
}