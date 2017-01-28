 function plot_bar(data_vec)
{
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
        return "有毒, 别出门";}
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