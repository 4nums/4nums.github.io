#!/usr/bin/perl
#use strict;
use warnings;
use LWP::Simple;
use List::Util qw(first max maxstr min minstr reduce shuffle sum);

open  FILE_1, "<rank.txt" or die $!; 
open FILE_RANK, ">rank.js" or die $!; 

my (@list_time, $line, @list, @puzzles);
$counter = 0;
print FILE_RANK " var the_rank_string = [";
while($line=<FILE_1>)
{
	push @puzzles , $line;
	print FILE_RANK "\"";
	$line =~ s/[\n\r]//g;
	print FILE_RANK $line; 
	if ($counter < 1361)
	{
		print FILE_RANK "\",";	
	}
	else {
		print FILE_RANK "\"";	
	}
	$counter++;
}
print FILE_RANK "];";
 

close(FILE_1);
close(FILE_RANK);

