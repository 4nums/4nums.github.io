function plot_line(data_vec, labels0, colors, curvenames, para)
{        
      var lineChartData = {
		labels : labels0, 
		datasets : [
				{
					label: " ",
					fillColor : "rgba(20,20,20,0.0)", // no fill color
					strokeColor : " ",
					pointColor : " ",
//					strokeWidth: 0,
//					pointStrokeColor : "rgba(255,0,0,1)",
//					pointHighlightFill : "#fff",
//					pointHighlightStroke : "rgba(220,220,220,1)",
					data : []
				}
			  ]
					

		} 
						
    for (ii = 0; ii < data_vec.length; ii ++)
    {
        if (ii > 0)
        {
            var aa=Object.create(lineChartData.datasets[0]);
            lineChartData.datasets.push(aa);
        }
   	//lineChartData.datasets[ii].label = curvenames[ii];
   	lineChartData.datasets[ii].strokeColor = colors[1][ii];
   	lineChartData.datasets[ii].pointColor = colors[0][ii];
	lineChartData.datasets[ii].data =data_vec[ii]; 
    }
    var ctx = document.getElementById(para.CANVAS_ID).getContext("2d");
    window.myLine = new Chart(ctx).Line(lineChartData, {
			 scaleOverride : true,
                         scaleSteps : para.scaleSteps,
                         scaleStepWidth : para.scaleStepWidth,
                         scaleStartValue : para.scaleStartValue,
                         pointDotRadius : para.pointDotRadius,	    
                         pointDot : para.pointDot,
                      	 bezierCurve: para.BEZIER,	
                      	  animation : false,   
                      	 scaleShowHorizontalLines: true,	
                      	 responsive: true
	   });
//        myLine.datasets[1].points[0].fillColor = "red"; //bar 3
//        myLine.update();   
  // legend(document.getElementById(para.LEGEND_ID), window.myLine);
 	 
}

function getlabels_dates (TL, gap_indata, our_gap, type1) // gap_indata is the gap in the data aquired, our_gap is the top level gap above all, we sample gap_indata x our_gap in the dates_list
{
    var size = TL;
    var labels =[];
    while (size--) labels.push(" ");
    var date_gap =   gap_indata * our_gap ;
    size = TL;
    var today = new Date(); 
    while(size > 0)
    {
        if (type1==0){
            labels[size-1] =  today.getFullYear() +'-'+(today.getMonth() + 1) ;}
        else if (type1==1){
                        labels[size-1] = (today.getMonth() + 1)  +'-'+  today.getDate();
                        }
        size -= our_gap; 
        today.setDate(today.getDate() - date_gap);
        }
    return labels; 
}