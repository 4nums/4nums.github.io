var was_sol = 0;
var click_op = 0;
var game_type2  = "请不要作弊                                                   ";
var game_type1  = " 点这里开始!";
var timerthis;
var game_str;
var all_lines;
var canvasID      = "canvasID";
var canvas_ele;
var canvas_cts;
var game_type_txt = "game_type";
var mainbodyID    = "page_body";
var status1       = 0;  // 0 : init screen 1: in game 3: quit or not, 4: showing solution
var width,  		height ;
var percent_w_init = 0.4, percent_h_init  = 0.4;
var xywh_init ,  xywh_init1;
var solved = 0, unsolved = 1362, totalQ = 1362;
var this_quad;
var time_now = 0, time_left = 0, time_tick = 0, game_tick = 0;  // time_tick is .01 second
var pause_tick = 0, pause_total = 500, pause_total1;
var coffee_tick = 0, coffee_total = 60001, coffee_num = 40, coffee_waiting = 0; 
var now, before;
var score_all = 0;  // the score 
var game_type = -1;
var id_array = new Array();
var time_array = new Array();
var show_sol = 1;

var quad, quad_c, quad_pos;  // the four numbers now and their positions
var quad_all, quad_prev, quad_all_prev;
var op_array = new Array('+', '-', '\u00D7', '\u00F7');
var op_focus, num_focus;
var past_steps, future_steps;
var this_order;

var num_rect, op_rect;
var rect_clock, rect_solved, rect_unsolved, rect_score;
var rect_quit, rect_skip, rect_undo, rect_redo, rect_addall, rect_multiplyall;
var rect_all, rect_QUIT_array; // rect_all is for game,  rect_QUIT_array is for quitting
var rect_sol, rect_no_sol;
var ep = 0.000001;
var num_ratio = 2/5, marg_ratio =  0.2, rect_thin_width = 3, rect_fat_width = 10;
var quit_ratio = 0.8;

function arraytostring(array1){
	var str1 = " ";
	for (ii = 0; ii < array1.length; ii ++)
	{
		str1 =  str1 + " " + array1[ii];
	}
	return str1;
}


function gameover(){


// quit or finished all
/*	document.getElementById("gamesub").time_now.value =  time_now;
	document.getElementById("gamesub").solved.value =  solved;
	document.getElementById("gamesub").unsolved.value =  unsolved;
	document.getElementById("gamesub").score_all.value =  Math.round(score_all);
	document.getElementById("gamesub").id_array.value = arraytostring(id_array);
	document.getElementById("gamesub").time_array.value =  arraytostring(time_array);
	document.getElementById("gamesub").submit();
*/
	set_title();
	init_game();
}

function new_quad(){
	var this_game = this_order[this_quad];  // first, grab the index of the game where  this_quad is (0,1,....) linearly
	quad_all = grab_quad_sol( (game_str[this_game]-1) ); 
	var quad1 = quad_all[0].split(",");
	quad = new Array();  	quad_c = new Array();
	for (ii = 3; ii >= 0; ii--) {
		thisone = Math.floor(Math.random()* (ii+1) );
		quad.push( Number(quad1[thisone]));
		quad_c.push( Number(quad1[thisone]));
		quad1.splice(thisone, 1);
	}
	time_tick = 0;
	quad_pos = new Array(0,1,2,3);
	op_focus = -1; // nothing on focus
	num_focus = -1; // nothing on focus
	past_steps = new Array();  //  no past yet
	future_steps = new Array(); // no future yet
	draw_rect(Array(0,0, width, height), "#fff", 0, "#000");
}

function solved1(solvedone){ // just solved one quad, move on to the next one
	id_array.push(game_str[this_order[this_quad]]); // save the quad
	this_quad++;
	quad_all_prev = quad_all; quad_prev = quad_c;  
	var a = quad_all_prev[1].split(" ");  
	pause_total1 = pause_total + a.length * 100;
	
	if (solvedone){
		solved ++;
		time_array.push(time_tick);
		score_all += 10 * ( 1 + 2 / a.length);
	}
	else {time_array.push(-time_tick);}
	unsolved --;
	if (show_sol == 1)
	{	pause_tick =0; status1 = 4; // showing solutions
	}
	if (unsolved >0){ new_quad();  }
	else{ 
		status1 = 6;// game over 
		gameover();
		}
	if (unsolved >0 && solvedone && solved%coffee_num ==0){
		if (show_sol ==0)
		{	coffee_tick = 0;status1 = 5;}
		else{ coffee_tick = 0;coffee_waiting = 1;}
	}
	game_tick  = 0;
	game_draw(0);
}

function calc(num1, op1, num2){	// caucluate num1 (op1) num2
	var num3 = 0.0;
	switch(op1){
		case 0: num3= num1 + num2; break;
		case 1: num3= num1 - num2;break;			 
		case 2: num3= num1 * num2;break;
		case 3: num3= num1 / num2;break;
	}
	if (Math.abs(num3 - Math.round (num3)) < ep) // num1 is integer
		return (Math.round(num3));
	else return (num3);
}


function game_order(){ // pick up the order of games
	var TOTAL_GAME = game_str.length;
	var final_order = new Array();
	var listall = new Array();
	for (ii = 0; ii < TOTAL_GAME; ii++){
		listall.push(ii);
	}
	var thisone; 
	for (ii = TOTAL_GAME -1; ii >=0; ii--){
		thisone = Math.floor(Math.random()* (ii + 1) );
		final_order.push(listall[thisone]);
		listall.splice(thisone, 1);
	}
	return final_order;
} 
function grab_quad_sol(this_id){
	var res = new Array();
	var pos = the_location[this_id];
	var ii = pos;
	while(the_string[ii] != "[") {ii--;}
	ii ++;
	res.push(the_string.substring(ii, pos));
	var jj = pos;
	while(the_string[jj] != "[") {jj++;}
	res.push(the_string.substring(pos + 2, jj-1));
	return res;
}


function ongame(regionID){
	if (regionID == -1) {return; } // clicked outside of the region
	if (regionID <4) { // click on one of the numbers
		var numrect_id = -1;
		var numfocus_id ;
		for (ii = 0; ii < quad.length; ii ++){
			if (regionID == quad_pos[ii]){ numrect_id = ii; }
			if (num_focus == quad_pos[ii]) {numfocus_id = ii;}
		}
		if (numrect_id < 0  || num_focus == regionID ){ return; }  // the region is gone already, or clicking on the already focused num
		else{
			if (op_focus < 0) {num_focus = regionID;}  // no op is chosen yet, change num_focus
			else{ // op is chosen, we'll do the calculation and do the logistics
				if (op_focus == 3 && Math.abs( quad[numrect_id])< ep) { return; }  // divided by 0
				else{
					past_steps.push(Array(quad.slice(0), quad_pos.slice(0), num_focus));
					quad[numrect_id] = calc( quad[numfocus_id], op_focus, quad[numrect_id]);
					num_focus = quad_pos[numrect_id];
					op_focus = -1;
					quad.splice(numfocus_id,1); 
					quad_pos.splice(numfocus_id,1);
					future_steps = new Array(); // nothing left to redo
				}
			}
		}
	}
	else if (regionID <8){ 
		var op_ID = regionID - 4;
		click_op = 1; 
		if (num_focus >=0 && quad.length > 1) {op_focus = op_ID;} // if some number is chosen and there are more than 2 nums left, then highlight the op
		else{return;} // no num is chosen, do nothing here
	}
	else if (regionID ==8){//undo
		if (past_steps.length>0 || op_focus >=0){ // there is something to undo
			if (op_focus >=0) {op_focus = -1;}  // change the choice of op
			else{
				future_steps.push(Array(quad.slice(0), quad_pos.slice(0),num_focus));
				var last_quads = past_steps.pop();
				quad = last_quads[0]; 
				quad_pos = last_quads[1];
				num_focus = last_quads[2];
			}
		}		
	}
	else if (regionID ==9){//redo
		if (future_steps.length >0){
			past_steps.push(Array(quad.slice(0), quad_pos.slice(0),num_focus));
			var next_quads = future_steps.pop();
			quad = next_quads[0]; 
			quad_pos = next_quads[1];
			num_focus = next_quads[2];
		}
	}
	else if (regionID ==10){//skip
	solved1(0); // didn't solve one.
	}
	else if (regionID ==11){//quit
//		status1 = 3;
//		game_draw(0);
	}
	else if (regionID == 12){// add all
		 op_focus = -1;   ongame(0);ongame(4);ongame(1);ongame(4);ongame(2);ongame(4);ongame(3);ongame(4);  game_draw(0); 
	}
 	else if (regionID == 13){// multiply all
		 op_focus = -1;   ongame(0);ongame(6);ongame(1);ongame(6);ongame(2);ongame(6);ongame(3);ongame(6);  game_draw(0); 
	}
}
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
function init_game( ){
	var ii; 
	var TOTAL = 5;
	game_str = new Array();
	all_lines = new Array();
	time_array = new Array();
	id_array  = new Array();
	for (ii = 1; ii < TOTAL + 1; ii ++)
	{ 	
		var ind1 = randomIntFromInterval(  Math.ceil(1361 * (ii-1) /TOTAL ), Math.floor(1361 * ii /TOTAL ));
		var line = the_rank_string[ind1];
	     var sp =  line.split(" ");
		 all_lines.push(line);
		game_str.push(Number(sp[1]) + 1); 
	}
 
 
	canvas_ele   =  document.getElementById(canvasID) ;
	canvas_ele.addEventListener("click", onclick1, false);
//	canvas_ele.addEventListener('keydown',handlekeydown,false);
	canvas_ele.setAttribute('tabindex','0');
	canvas_ele.focus();
	width  = canvas_ele.width;
	height = canvas_ele.height;
	//width =  window.innerWidth;
	//height = window.innerHeight;
	status1   = 0;
       xywh_init  = new Array( width * percent_w_init / 2,   height * percent_h_init / 4, 	  	  width * ( 1- percent_w_init),    height * ( 1- percent_h_init) / 2);
       xywh_init1 = new Array( width * percent_w_init / 2,   height * (percent_h_init / 4 + 0.5), 	  width * ( 1- percent_w_init),    height * ( 1- percent_h_init) / 2);
	canvas_cts = canvas_ele.getContext( "2d");
	game_draw(0);
}
function click_ID(x,y, rect_array){
	var total = rect_array.length;
	var ii ;
	for ( ii = 0; ii < total ; ii ++){
		if (x >= rect_array[ii][0] && x <= rect_array[ii][0] + rect_array[ii][2] && y >= rect_array[ii][1] && y <= rect_array[ii][1] + rect_array[ii][3]){
			return ii;
		}
	}
	return -1 ;
}
function draw_rect(rect1, color1, border_wid1, color2 ){
	canvas_cts.fillStyle = color1;   // button color
	canvas_cts.fillRect (rect1[0], rect1[1], rect1[2], rect1[3]);	
	canvas_cts.lineWidth   = border_wid1;
	canvas_cts.strokeStyle  = color2;   // button color
	if (border_wid1>0)
		canvas_cts.strokeRect(rect1[0] + border_wid1/ 2, rect1[1] + border_wid1/2, rect1[2] - border_wid1, rect1[3] - border_wid1);
}

function draw_text (xy_array, text1, fillstyle1, font1){
	canvas_cts.fillStyle = fillstyle1; // font color
	canvas_cts.font = font1; 
	canvas_cts.fillText(text1, xy_array[0], xy_array[1]);
}
function text_in_rect(rect1, text_string)
{ // given text string and the rect, return the ideal x,y and fontsize

	var fontsize = rect1[2] /Math.max(5, text_string.length + 2) * 2;
	var y = rect1[1] + rect1[3]/1.9 + 0.2 *  fontsize ;
	var x = rect1[0] + rect1[2]/2 - fontsize * text_string.length /4;

	return (Array(x,y, fontsize));	
}

function num_to_string (num1){
	var  result = "";
	if (Math.abs(num1 - Math.round (num1)) < ep) // num1 is integer
		return (result + num1);
	var ii = 2;
	var ii_mul_num1;
	while (1) {
		ii_mul_num1 = ii * num1;
		if (Math.abs(ii_mul_num1 - Math.round (ii_mul_num1)) < ep){
			return (result + Math.round(ii_mul_num1) + "/" + ii);
		}
		else 
			ii ++;
	}
	return result;
}

function num_to_string1 (num1){
	var  result = "";
	if (num1 - Math.ceil (num1) > -ep) // num1 is integer
		return (result + num1);
	var ii = 2;
	var ii_mul_num1;
	while (1) {
		ii_mul_num1 = ii * num1;
		if (ii_mul_num1 - Math.ceil (ii_mul_num1) > -ep){
			return (result + Math.round(ii_mul_num1) + "/" + ii);
		}
		else 
			ii ++;
	}
	return result;
}


function start_game(){
	status1 = 1;
	game_type = 1;
	time_now = 0;	
	solved   = 0;
	unsolved = game_str.length;
	score_all = 0;
	this_quad = 0;  // start from the first game
	this_order = game_order();
	new_quad ();
	now, before = new Date()
	show_sol = 1;
	pause_total = 501;
	coffee_total = 60001; coffee_waiting = 0;





	var N1 = num_ratio; 
	var rect1 = new Array( marg_ratio * width * N1,marg_ratio * width * N1, (1- 2 * marg_ratio) * width * N1, (1- 2 * marg_ratio) * width* N1);
	var rect2 = new Array( (1 + marg_ratio )* width * N1,marg_ratio * width * N1, (1- 2 * marg_ratio) * width * N1, (1- 2 * marg_ratio) * width* N1);
	var rect3 = new Array( marg_ratio * width * N1, (1 + marg_ratio) * width* N1, (1- 2 * marg_ratio) * width * N1, (1- 2 * marg_ratio) * width* N1);
	var rect4 = new Array( (1 + marg_ratio) * width * N1, (1 + marg_ratio)* width* N1, (1- 2 * marg_ratio) * width * N1, (1- 2 * marg_ratio) * width* N1);
	num_rect  = new Array(rect1, rect2, rect3, rect4);  // the rects for the numbers
	rect_all  = new Array(rect1, rect2, rect3, rect4);   	

	var UNIT_wh = width / 4; 
	var Lower_height = (height -  2 * N1 * width) / 2;
	if (UNIT_wh > Lower_height)
		UNIT_wh = Lower_height; 

	marg_ratio = 0.05;	
	var tmp1 =  (1- 2 * marg_ratio) *UNIT_wh;
	op_rect = new Array();
	for (ii = 0; ii < 4; ii ++){	
		rect1 = new Array( (1 + ii * 2) * width/8 - tmp1/2, N1 *2* width +(height - N1 * 2*width)/4 - tmp1/2, tmp1, tmp1);
		op_rect.push(rect1); rect_all.push(rect1);
	}
	
	var rect_tmpv = new Array();
	for (ii = 0; ii < 4; ii ++){
		var tmp1 =  (1- 2 * marg_ratio) *UNIT_wh;
		rect1 = new Array( (1 + ii * 2) * width/8 - tmp1/2, N1 *2* width +(height - N1 * 2*width)*.75 - tmp1/2, tmp1, tmp1);
		rect_tmpv.push(rect1);
	}
	rect_undo = rect_tmpv[0];
	rect_redo = rect_tmpv[3];
	rect_addall = rect_tmpv[1];
	rect_multiall = rect_tmpv[2];

/////
/*


	var marg_ratio =  0.1; 
	var rect1 = new Array( marg_ratio * width /3,marg_ratio * height /3, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /3);
	var rect2 = new Array( (1 + marg_ratio )* width /3,marg_ratio * height /3, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /3);
	var rect3 = new Array( marg_ratio * width /3, (1 + marg_ratio) * height /3, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /3);
	var rect4 = new Array( (1 + marg_ratio) * width /3, (1 + marg_ratio)* height /3, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /3);
	num_rect  = new Array(rect1, rect2, rect3, rect4);  // the rects for the numbers
	rect_all  = new Array(rect1, rect2, rect3, rect4);   	

	marg_ratio = 0.05;
	rect1 = new Array( marg_ratio * width /6, (4 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /6, (1- 2 * marg_ratio) * width /6);
	rect2 = new Array( (marg_ratio + 1) * width /6, (4 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /6, (1- 2 * marg_ratio) * width /6);
	rect3 = new Array( (marg_ratio  + 2)* width /6, (4 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /6, (1- 2 * marg_ratio) * width /6);
	rect4 = new Array( (marg_ratio  + 3)* width /6, (4 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /6, (1- 2 * marg_ratio) * width /6);
	op_rect = new Array(rect1, rect2, rect3, rect4);  // the rects for the numbers
	rect_all.push(rect1, rect2, rect3, rect4);	
	marg_ratio = 0.2;
	rect_undo = new Array( marg_ratio * width /3, (5 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /6);
	rect_redo = new Array( (marg_ratio + 1)* width /3, (5 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /6);
*/


	rect_score = new Array(0,0,0,0);

	rect_tmpv = new Array();
	for (ii = 0; ii < 3; ii ++){
		var tmp1 =  N1 * width, tmp2 = width - 2* N1* width + N1 *  marg_ratio * N1;
		rect1 = new Array( width - tmp2, (ii + 1) * tmp1/2, tmp2, tmp1/2);
		rect_tmpv.push(rect1);
	}

	rect_clock = rect_tmpv[0];
	rect_solved   = rect_tmpv[1];
	rect_unsolved = rect_tmpv[2];


	rect_quit  = new Array( (marg_ratio + 2)* width /3, (marg_ratio/2 + 2) * height /3, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /6);
	rect_skip  = new Array( width * ( 1- (1-N1*1.8) * quit_ratio)+4, marg_ratio * width * N1, -8 + (1-N1*1.8) * quit_ratio* width, (1-N1*1.97) * quit_ratio* width);
	
	//rect_all.push(rect_undo, rect_redo, rect_skip, rect_quit); // rect 8,9,10,11
	rect_all.push(rect_undo, rect_redo, rect_skip, rect_quit, rect_addall, rect_multiall); // rect 8,9,10,11
		

	rect1 = new Array( marg_ratio * width /3, (3 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /6);
	rect2 = new Array( (marg_ratio + 1)* width /3, (3 + marg_ratio) * height /6, (1- 2 * marg_ratio) * width /3, (1- 2 * marg_ratio) * height /6);

	rect_QUIT_array = new Array(rect1, rect2); 

	//rect_sol = new Array( marg_ratio * width /4, (1 - 2 *  marg_ratio) * height /6, (3 + 1 * marg_ratio) * width /4, (4.5 + 2 * marg_ratio) * height /6);
	//rect_no_sol = new Array( rect_sol[0] * 2.5, rect_sol[1] + rect_sol[3] * 0.7, rect_sol[2] * 0.8,  rect_sol[3] * 0.2);
	 var b_ratio = 0.1, b_ratio1 = 0.05; 
	rect_sol = new Array(b_ratio * width, b_ratio * height, width - 2 * b_ratio * width, height - 2 * b_ratio * height);
	rect_no_sol = new Array( (b_ratio1 + b_ratio )* width, height - (b_ratio1 + 2 * b_ratio) * height, width - 2* (b_ratio1 +b_ratio)* width, b_ratio * height);
	game_draw(0);
	clearInterval(timerthis);
	timerthis = setInterval(function(){tickclock()},10);
//	tickclock();
}
function tickclock(){
	if (status1 == 1 || status1 ==3){ // status1 = 3 then it's waiting for the decision on quit or not
		now = new Date();
	       var elapsedTime = now.getTime() - before.getTime();
		var a = 1;
		if(elapsedTime > 12){ a= Math.floor(elapsedTime/10); }
		before = new Date();    
		time_tick +=a;
		game_tick +=a;
		if (game_tick % 100 ==0){
			
			if (game_type ==0){ 
				time_now = 10 * (solved +12) - Math.floor(game_tick/100) - 20 * (totalQ - solved - unsolved);
				score_all = score_all + 0* solved * 60;
			}
			else{
				time_now = Math.floor(game_tick/100);
				score_all = score_all + 0 * solved * 60 - time_now * 0 ;
			}
			game_draw(1);
		}
		if (time_now < 0 && game_type == 0) {time_now =0; game_draw(1); gameover(); return;}		 
	}
	else if (status1 == 4){ 
			now = new Date(); 
			var elapsedTime = now.getTime() - before.getTime();
			var a = 1;
			if(elapsedTime > 12){ a= Math.floor(elapsedTime/10); }
			before = new Date();    
			pause_tick +=a;
			var extra_tick = pause_tick - pause_total1;
			if(extra_tick >= 0) 	{ 
				if(coffee_waiting == 0) {game_tick += extra_tick; status1 = 1;game_draw(0);}
				else{game_tick += extra_tick; status1 =5; coffee_waiting=0;game_draw(0);}
			}
			if (pause_tick % 100 ==0){game_draw(0);}
	}
	else if (status1 == 5){
			now = new Date(); 
			var elapsedTime = now.getTime() - before.getTime();
			var a = 1;
			if(elapsedTime > 12){ a= Math.floor(elapsedTime/10); }
			before = new Date();    
			coffee_tick +=a;
			var extra_tick = coffee_tick - coffee_total;
			if(extra_tick >= 0) 	{game_tick += extra_tick; status1 = 1;game_draw(0);}
			if (coffee_tick % 100 ==0){game_draw(0);}

	}
}
 

function game_draw(isclock){ // 0) status1, 1) game_type, 2) time, time_left, 3) solved, unsolved, 4) this game history
	if (status1 == 0){
		draw_rect(Array(0,0, width, height), "#fff", 0, "#000"); // clean the whole region
		draw_rect(xywh_init1, "#00a", 5, "#00a");
//		draw_rect(xywh_init,  "#ccc", 5, "#00f");
		draw_text (Array(xywh_init[0] + xywh_init[2] / 4.5, xywh_init[1] + xywh_init[3] /1.9),game_type2, "#000",  "bold " + Math.round(xywh_init[2]/10) +"px sans-serif");
		draw_text (Array(xywh_init1[0] + xywh_init1[2] /5, xywh_init1[1] + xywh_init1[3] /1.9),game_type1, "#fff",  "bold " + Math.round(xywh_init1[2]/10) +"px sans-serif");
		return;
	}
	if (isclock)	{ // only need to update the clock region
		draw_rect(Array(rect_clock[0],rect_clock[1],rect_clock[2] * 1.3,rect_clock[3]) ,  "#fff", 0, "#00f");
		var colortext = "#000"; if (time_now <=20 && game_type ==0) colortext ="#f00";
		draw_text(Array(rect_clock[0], rect_clock[1] + rect_clock[3]/1.9), "用时: " + time_now, colortext, "bold " + Math.round(rect_clock[2]/5) +"px sans-serif");
		draw_rect(Array(rect_score[0],rect_score[1],rect_score[2] * 1.3,rect_score[3]) ,  "#fff", 0, "#00f");
//		draw_text(Array(rect_score[0], rect_score[1] + rect_score[3]/1.9), "Score:" + Math.round(score_all), "#000", "bold " + Math.round(rect_score[2]/5) +"px sans-serif");
		return;	
	}
	if (was_sol  ==1 && status1 !=4){//}
		draw_rect(Array(0,0, width, height), "#fff", 0, "#000"); // clean the whole region
		was_sol  = 0; 
	}
	draw_rect(Array(rect_clock[0],rect_clock[1],rect_clock[2] * 1.3,rect_clock[3]) ,  "#fff", 0, "#00f");
	draw_text(Array(rect_clock[0], rect_clock[1] + rect_clock[3]/1.9), "用时: " + time_now, "#000", "bold " + Math.round(rect_clock[2]/5) +"px sans-serif");
	draw_rect(Array(rect_score[0],rect_score[1],rect_score[2] * 1.3,rect_score[3]) ,  "#fff", 0, "#00f");
	//draw_text(Array(rect_score[0], rect_score[1] + rect_score[3]/1.9), "Score:" +  Math.round(score_all), "#000", "bold " + Math.round(rect_score[2]/5) +"px sans-serif");


	draw_rect(rect_solved ,  "#fff", 0, "#000");  		
	draw_text(Array(rect_solved[0], rect_solved[1] + rect_solved[3]/1.9), "已解: \n" + solved, "#000", "bold " + Math.round(rect_solved[2]/6) +"px sans-serif");

	draw_rect(rect_unsolved ,  "#fff", 0, "#000");
	if(game_type==1) draw_text(Array(rect_unsolved[0], rect_unsolved[1] + rect_unsolved[3]/1.9), "未解: " + unsolved, "#000", "bold " + Math.round(rect_unsolved[2]/6) +"px sans-serif");

//	draw_rect(rect_quit ,  "#fff", 3, "#f00");
//	draw_text(Array(rect_quit[0], rect_quit[1] + rect_quit[3]/1.6), "      Quit", "#f00", "bold " + Math.round(rect_quit[2]/6) +"px sans-serif");

	draw_rect(rect_skip ,  "#fff", 3, "#00f");
	draw_text(Array(rect_skip[0]+rect_skip[2]/2.6, rect_skip[1] + rect_skip[3]/1.6), "跳 过", "#00f", "bold " + Math.round(rect_skip[2]/6) +"px sans-serif");
	var colorredo = "#000", widthredo = 5;
	if (future_steps.length ==0){ colorredo = "#aaa"; widthredo = 2;}
	draw_rect(rect_redo ,  "#fff", widthredo , colorredo );
	var redo = "  \u2192";
	draw_text(Array(rect_redo[0], rect_redo[1] + rect_redo[3]/1.2), redo, colorredo , "bold " + Math.round(rect_redo[2]/2) +"px sans-serif");

	var colorundo = "#000", widthundo = 5;
	if (past_steps.length ==0 && op_focus < 0 ){ colorundo = "#aaa"; widthundo = 2;}
	draw_rect(rect_undo ,  "#fff", widthundo,colorundo);
	var undo = "  \u2190";
	draw_text(Array(rect_undo[0], rect_undo[1] + rect_undo[3]/1.2), undo ,colorundo, "bold " + Math.round(rect_undo[2]/2) +"px sans-serif");

	var raty = new Array(1.2,1.43,1.2,1.2);
	var ratx = new Array(4.5,3.4,4.5,4.5);

	var ratx = new Array(4.5,2.8,4.5,4.5, 10.5);
	var raty = new Array(1.2,1.3,1.2,1.2, 1.2 );

	var coloraddall = "#00a";
  	draw_rect(rect_addall ,  "#fff", 2, "#666" );
	var addall = "\u2295"
 	draw_text(Array(rect_addall [0]+ 0*rect_addall [3]/ratx[4], rect_addall [1] + rect_addall [3]/raty [4]), addall , coloraddall , "bold " + Math.round(rect_addall[2]/1) +"px sans-serif");

	var colormultiall = "#a0a";
 	draw_rect(rect_multiall ,  "#fff", 2, "#666" );
	var addall = "\u2297"
	draw_text(Array(rect_multiall [0]+ 0* rect_multiall [3]/ratx[4], rect_multiall [1] + rect_multiall [3]/raty [4]), addall , colormultiall , "bold " + Math.round(rect_multiall [2]/1) +"px sans-serif");



	for (ii = 0; ii < 4; ii ++)
	{// draw ops
		var op_rect1 = op_rect[ii];
		if (ii == op_focus){
			draw_rect(op_rect1,  "#fff", 6, "#000");
			draw_text(Array(op_rect1[0]+ op_rect1[3]/ratx[ii], op_rect1[1] + op_rect1[3]/raty[ii]), op_array[ii] , "#000", "bold " + Math.round(op_rect1[2]/1) +"px sans-serif");
		}
		else{
				draw_rect(op_rect1,  "#fff", 1, "#666");
				draw_text(Array(op_rect1[0]+ op_rect1[3]/ratx[ii], op_rect1[1] + op_rect1[3]/raty[ii]), op_array[ii] , "#666", "bold " + Math.round(op_rect1[2]/1) +"px sans-serif");			
		}			
	} 
	if (click_op == 1)
	{
		click_op = 0; 
		return; 
	}
	var rest_rect = new Array();
	for (ii = 0; ii < 4; ii ++)
	{
		var flag = 0; 
		for(jj = 0; jj < quad_pos.length; jj ++)
		{ if (quad_pos[jj] == ii)
			{flag =1; break;}
		}
		if (flag==0)
		{	rest_rect.push(ii); 	 }
		
	}
 	for (ii= 0; ii < rest_rect.length; ii++)
	{	draw_rect(num_rect[rest_rect[ii]],  "#fff", 0, "#fff"); 
	}
	for (ii = 0; ii < quad.length; ii ++){ 
		var num_rect1 = num_rect[quad_pos[ii]];
		var text_string =  num_to_string (quad[ii]); 
  		var xy_fontsize = text_in_rect(num_rect1, text_string);
		if (quad_pos[ii] == num_focus){
			if (quad.length == 1){
				if (Math.abs(quad[0] - 24) < ep){
					if (status1 == 1) solved1(1);
				}
				else{
					draw_rect(num_rect1,  "#fff", 6, "#FF0000"); 
					draw_text(Array(xy_fontsize[0], xy_fontsize[1]), text_string, "#FF0000", "bold " + xy_fontsize[2] + "px sans-serif");
				}
			}
			else{
				draw_rect(num_rect1,  "#fff", 6, "#0F7100"); 
				draw_text(Array(xy_fontsize[0], xy_fontsize[1]), text_string, "#0F7100", "bold " + xy_fontsize[2] + "px sans-serif");		
			}
		}
		else{
			draw_rect(num_rect1,  "#fff", 1, "#55B72B"); //#0F7100 darker
			draw_text(Array(xy_fontsize[0], xy_fontsize[1]), text_string, "#55B72B", "bold " + xy_fontsize[2] + "px sans-serif");
		}
	}	
	if (status1==3){ // draw the message rect on top of the said game
		var marg_ratio =  0.1; 
		var messbox = Array( marg_ratio * width /4, (1 + marg_ratio) * height /6, (2 - 1 * marg_ratio) * width /3, (3 + 2 * marg_ratio) * height /6);
		draw_rect(messbox, "#fff", 4, "#000");
		draw_text(Array( (1+marg_ratio) * width /6, (2 + marg_ratio) * height /6), "Quit?", "#f00", "bold " + Math.round(rect_QUIT_array[0][2]/2) +"px sans-serif");
		draw_rect(rect_QUIT_array[0],"#fff", 1, "#000");  		draw_rect(rect_QUIT_array[1],"#fff", 1, "#000");
		draw_text(Array(rect_QUIT_array[0][0], rect_QUIT_array[0][1] + rect_QUIT_array[0][3]/1.3), "   No", "#000", "bold " + Math.round(rect_QUIT_array[0][2]/3) +"px sans-serif");
		draw_text(Array(rect_QUIT_array[1][0], rect_QUIT_array[1][1] + rect_QUIT_array[1][3]/1.3), "  Yes", "#000", "bold " + Math.round(rect_QUIT_array[1][2]/3) +"px sans-serif");

	}
	if (status1 == 4 && show_sol){ // show the solutions waiting for the esc

/*		draw_rect(rect_sol, "#fff", 2, "#bbb");
		draw_rect(rect_no_sol, "#fff", 4, "#bbb");
		draw_text(Array(rect_no_sol[0] * 1.6, rect_sol[1]  + rect_sol[3] * 0.05 ), "    点击任何地方或者等待  " + ((pause_total1-pause_tick)/100).toFixed(0) + "   秒", "#888", "bold " + Math.round(rect_no_sol[3]/5) +"px sans-serif");
		draw_text(Array(rect_no_sol[0] * 1.0, rect_sol[1]  + rect_sol[3] * 0.05 * 2.5 ), "答案在下面   ", "#000", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
		draw_text(Array(rect_no_sol[0] * 3.5, rect_sol[1]  + rect_sol[3] * 0.05 * 2.5 ),  quad_prev[0] + "  "+ quad_prev[1] + "  "+ quad_prev[2] + "  "+ quad_prev[3] , "#0F7100", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");

		//draw_text(Array(rect_no_sol[0] * 0.5, rect_sol[1]  + rect_sol[3] * 0.05 * 3 ), "Solutions for   "  + quad_prev[0] + " "+ quad_prev[1] + " "+ quad_prev[2] + " "+ quad_prev[3] , "#000", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");

		var sol_vec = quad_all_prev[1].split(" ");
		if (sol_vec.length > 6){
			for (ii = 0; ii < sol_vec.length; ii +=2)
				 draw_text(Array(rect_no_sol[0] * 1.0, rect_sol[1]  + rect_sol[3] * (0.05 *4.0+ ii/2 * 0.09) ), "["+ (ii +1) +"] " +sol_vec[ii], "#008", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
			for (ii = 1; ii < sol_vec.length; ii +=2)
				 draw_text(Array(rect_no_sol[0] * 3.7, rect_sol[1]  + rect_sol[3] * (0.05 *4.0+ (ii-1)/2 * 0.09) ), "["+ (ii +1) +"] " +sol_vec[ii], "#008", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
		}
		else{
			for (ii = 0; ii < sol_vec.length; ii ++)
			 draw_text(Array(rect_no_sol[0] * 2.5, rect_sol[1]  + rect_sol[3] * (0.05 *4.0+ ii * 0.09) ), "["+ (ii +1) +"] " +sol_vec[ii], "#008", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
		}
		// quad_all_prev[1]
		draw_text(Array(rect_no_sol[0] * 1.9, rect_no_sol[1] * 1.15), "请再也不要显示答案了", "#888", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
*/
		was_sol  = 1; 
		var text_never_show_sol ="     再也不要显示答案了         ";
		draw_rect(rect_sol, "#fff", 2, "#bbb");
		draw_rect(rect_no_sol, "#fff", 4, "#bbb");
		var text_touch =  "触摸任何地方或者等待   " + ((pause_total1-pause_tick)/100).toFixed(0) + " 秒钟              ";		var rect_cof = new Array(rect_no_sol[0],rect_sol[1],rect_no_sol[2],rect_no_sol[3]/2);
		var tmp2 = text_in_rect (rect_cof, text_touch ); 
		draw_text (Array(tmp2 [0], tmp2 [1]), text_touch , "#888" , "bold " + tmp2 [2] +"px sans-serif");
		var text_solu = "下面显示所有独立解给 " + quad_prev[0] + "  "+ quad_prev[1] + "  "+ quad_prev[2] + "  "+ quad_prev[3];
		var rect_cof1 = new Array(rect_no_sol[0] + rect_no_sol[3]/4, rect_sol[1] + rect_no_sol[3]*2/3, rect_no_sol[2], rect_no_sol[3]/4);
		tmp2 = text_in_rect (rect_cof1, text_solu+"             "); 
		draw_text (Array(tmp2 [0], tmp2 [1]), text_solu , "#222" , "bold " + tmp2 [2] +"px sans-serif");

		var sol_vec = quad_all_prev[1].split(" ");
		if (sol_vec.length > 6){
			for (ii = 0; ii < sol_vec.length; ii +=2)
				 draw_text(Array(rect_no_sol[0] * 1.0, rect_sol[1]  + rect_sol[3] * (0.05 *4.0+ ii/2 * 0.09) ), "["+ (ii +1) +"] " +sol_vec[ii], "#008", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
			for (ii = 1; ii < sol_vec.length; ii +=2)
				 draw_text(Array(rect_no_sol[0] * 3.7, rect_sol[1]  + rect_sol[3] * (0.05 *4.0+ (ii-1)/2 * 0.09) ), "["+ (ii +1) +"] " +sol_vec[ii], "#008", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
		}
		else{
			for (ii = 0; ii < sol_vec.length; ii ++)
			 draw_text(Array(rect_no_sol[0] * 2.5, rect_sol[1]  + rect_sol[3] * (0.05 *4.0+ ii * 0.09) ), "["+ (ii +1) +"] " +sol_vec[ii], "#008", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
		}
		var tmp2 = text_in_rect (rect_no_sol, text_never_show_sol); 
		draw_text (Array(tmp2 [0], tmp2 [1]), text_never_show_sol, "#888" , "bold " + tmp2 [2] +"px sans-serif");

	}
	if (status1 == 5){
		draw_rect(rect_sol, "#fff", 2, "#bbb");
		draw_rect(rect_no_sol, "#fff", 4, "#bbb");
		draw_text(Array(rect_no_sol[0] * 1.5, rect_sol[1]  + rect_sol[3] * 0.05 *3 ), "Coffee break over in " + ((coffee_total-coffee_tick)/100).toFixed(0) + "   seconds", "#888", "bold " + Math.round(rect_no_sol[3]/5) +"px sans-serif");

		draw_text(Array(rect_no_sol[0] * 1.4, rect_no_sol[1] * 1.15), "Take me back to the game!", "#00f", "bold " + Math.round(rect_no_sol[3]/4) +"px sans-serif");
	}

}
function handlekeydown(e){
	switch(e.keyCode){
		case 27:	if(status1 == 4) {status1 = 1;     game_draw(0);   
							if(coffee_waiting == 1){status1 =5; coffee_waiting=0;game_draw(0);}
				}
				else if (status1 == 1){ ongame(8); game_draw(0);} // undo	
				else if (status1 == 3){status1 = 1; game_draw(0);} // not quitting
		break;
		case 192:    if (status1 == 1){ ongame(9); game_draw(0);} // redo
		break; 
		case 49:     if (status1 == 1){ ongame(0); game_draw(0);} break; // pick 1
		case 50:     if (status1 == 1){ ongame(1); game_draw(0);} break; // pick 2
		case 51:     if (status1 == 1){ ongame(2); game_draw(0);} break; // pick 3
		case 52:     if (status1 == 1){ ongame(3); game_draw(0);} break; // pick 4
		case 100:     if (status1 == 1){ ongame(0); game_draw(0);} break; // pick 1
		case 101:     if (status1 == 1){ ongame(1); game_draw(0);} break; // pick 2
		case 97:     if (status1 == 1){ ongame(2); game_draw(0);} break; // pick 3
		case 98:     if (status1 == 1){ ongame(3); game_draw(0);} break; // pick 4

		case 81:     if (status1 == 1){ ongame(4); game_draw(0);} break; // pick +
		case 87:     if (status1 == 1){ ongame(5); game_draw(0);} break; // pick -
		case 69:     if (status1 == 1){ ongame(6); game_draw(0);} break; // pick *
		case 82:     if (status1 == 1){ ongame(7); game_draw(0);} break; // pick /
		case 65:     if (status1 == 1) {  op_focus = -1;   ongame(0);ongame(4);ongame(1);ongame(4);ongame(2);ongame(4);ongame(3);ongame(4);  game_draw(0); } break; // all sum up
		case 83:     if ((status1 == 1) ) {  op_focus = -1;   ongame(0);ongame(6);ongame(1);ongame(6);ongame(2);ongame(6);ongame(3);ongame(6);  game_draw(0); } break; // all multiplied up
		default:
	}
}
function onclick1 (e){
	var canvas = document.getElementById(canvasID);
       var x, y;
	var mainbody = document.getElementById(mainbodyID);

       if (e.pageX != undefined && e.pageY != undefined) {
  		x = e.pageX;
		y = e.pageY;
       }
       else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
       }
       x -= (canvas.offsetLeft + mainbody.offsetLeft);
       y -= (canvas.offsetTop + mainbody.offsetTop);  
	switch (status1){
		case  0: // on the init-game screen
 			var rect_arr = new Array(xywh_init, xywh_init1);
			game_genre = click_ID(x,y, rect_arr);
			if (game_genre>=1){
				game_type = 1;
				start_game ();

			}
		break;
		case 1:
			var regionID = click_ID(x,y,rect_all);
			ongame(regionID);
			game_draw(0);
		break;
		case 3:   // on the quit or not window
			var region_ID = click_ID(x,y, rect_QUIT_array);
			if (region_ID == 0) { // not quitting
				status1 = 1; game_draw(0);
			}
			else if (region_ID == 1){ //game_over
				gameover();
			}
		break; 
		case 4: //show solutions
			var ar1 = new Array(rect_no_sol);
			if (click_ID(x,y, ar1) == 0 )
			{ show_sol = 0;  status1=1; game_draw(0);}
			else {status1=1; game_draw(0);}
			if(coffee_waiting == 1){status1 =5; coffee_waiting=0;game_draw(0);}
		break;
		case 5://coffeebreak
			var ar1 = new Array(rect_no_sol);
			if (click_ID(x,y, ar1) == 0 )
			{  status1=1; game_draw(0);}

		break; 
		default : 
	}
}
 
