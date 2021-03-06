/*
PseuCo Compiler  
Copyright (C) 2013  
Saarland University (www.uni-saarland.de)  
Sebastian Biewer (biewer@splodge.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

{
	var rangeDefinitions = new Environment();
	var autoProcessComplete = CCSStop;
}

start = C:CCS { return C; }

CCS
  = PDefs:(Process/RangeDefinition)* _ System:Sequence _ !.
		                                { 
		                                	var defs = [];
		                                  	for (var i = 0; i < PDefs.length; i++) {
		                                  		if (PDefs[i])
		                                  			defs.push(PDefs[i]);
		                                  	}
		                                  	return new CCS(defs, System).setCodePos(location().start.line,location().start.column);
		                                }
                                

RangeDefinition
  = _ "range" _ id:name _ ":=" _ r:CoreRange _ { rangeDefinitions.setValue(id, r); return null; }


Process
  = _ n:name _ params:("[" _ v:ValueIdentifier vs:(_ "," _ v2:ValueIdentifier { return v2; })* _ "]" _ { vs.unshift(v); return vs; } )? ":=" P:Sequence __ [\n\r]+
		                                { 
		                                  var res = new CCSProcessDefinition(n, P, params ? params : null, location().start.line).setCodePos(location().start.line,location().start.column);
		                                  return res;
		                                }




Restriction
  = _ P:Prefix res:(_ "\\" _ "{" as:(_ a1:(channel / "*") as2:(_ "," _ a2:channel { return a2; })* { as2.unshift(a1); return as2; } )? _ "}" { return  (as) ? as : []; })?
  										{
  											res = res ? new CCSRestriction(P, res).setCodePos(location().start.line,location().start.column) : P;
  											//res.line = location().start.line;
  											return res;
  										}


Sequence
  = _ P:Parallel Ps:(_ ";" Q:Parallel { return Q; })*
		                                {
		                                  Ps.unshift(P);
		                                  while(Ps.length > 1){
		                                    var p = Ps.shift();
		                                    var q = Ps.shift();
		                                    Ps.unshift(new CCSSequence(p,q).setCodePos(location().start.line,location().start.column));
		                                  }
		                                  return Ps[0];
		                                }
	                                
	                                

Parallel
  = _ P:Choice Ps:(_ "|" Q:Choice { return Q; })*
		                                {
		                                  Ps.unshift(P);
		                                  while(Ps.length > 1){
		                                    var p = Ps.shift();
		                                    var q = Ps.shift();
		                                    Ps.unshift(new CCSParallel(p,q).setCodePos(location().start.line,location().start.column));
		                                  }
		                                  return Ps[0];
		                                }




Choice
  = _ P:Restriction Ps:(_ "+" Q:Restriction { return Q; })*
									  {
									    Ps.unshift(P);
									    while(Ps.length > 1){
									      var p = Ps.shift();
									      var q = Ps.shift();
									      Ps.unshift(new CCSChoice(p,q).setCodePos(location().start.line,location().start.column));
									    }
									    return Ps[0];
									  }



Prefix
  = Condition
  	/ _ A:(Match
		/ Input
		/ Output
		/ SimpleAction ) P:PostPrefix?
									{ 
										return new CCSPrefix(A, P).setCodePos(location().start.line,location().start.column); 
									}
	/ Trivial
	


Condition
  = _ "when" _ "(" _ e:expression _ ")" _ P:Prefix
	  								{
	  									return new CCSCondition(e, P).setCodePos(location().start.line,location().start.column);
	  								}
	  								
PostPrefix
  //= &";"		{ return new CCSExit(); }
  // (&";"/&"+"/&"|"/&"\\"/!.) { return new autoProcessComplete().setCodePos(location().start.line,location().start.column); }
  = _ "." P:Prefix	{ return P; }

Match
  = a:Action _ "?" _ "(" _ e:expression _ ")"
									{ 
										return new CCSMatch(a, e).setCodePos(location().start.line,location().start.column); 
									}
  								

Input
  = a:Action _ "?" v:(_ t:ValueIdentifier { return t; })?
	  								{ 
	  									return new CCSInput(a, v).setCodePos(location().start.line,location().start.column); 
	  								}


Output
  = a:Action _ "!" e:(_ t:expression { return t; })?
	  								{ 
	  									return new CCSOutput(a, e ? e : null).setCodePos(location().start.line,location().start.column); 
	  								}



SimpleAction
  = a:Action
	                                { 
	                                	return new CCSSimpleAction(a).setCodePos(location().start.line,location().start.column); 
	                                }


Action
  = c:channel e:( "(" e:expression? ")" { return e; } )?
  									{
  										if (!e) e = null;
  										return new CCSChannel(c, e).setCodePos(location().start.line,location().start.column);
  									}
	                                
	                                


                                


Trivial
  = _ "(" P:Sequence _ ")"       { 
  										return P; 
  									}
  / _ "0"                         	{ 
  										return new CCSStop().setCodePos(location().start.line,location().start.column); 
  									}
  / _ "1"                         	{ 
  										return new CCSExit().setCodePos(location().start.line,location().start.column); 
  									}
  / _ n:name 
  		args:(_ "[" _ e:expression es:(_ "," _ e1:expression { return e1; })* _ "]" { es.unshift(e); return es; } )?
  			                     	{ 
                                  		return new CCSProcessApplication(n, args).setCodePos(location().start.line,location().start.column);
                                	}

name "name"
  = first:[A-Z] rest:[$A-Za-z0-9_]* { return first + rest.join(''); }

// The following rules are the same, but they have different names which makes error messages better understandable!
identifier "identifier"
  = first:[a-z_$] rest:[A-Za-z0-9_$]* { return first + rest.join(''); }

ValueIdentifier
  = id:identifier __ r:(InlineRange)?	{ return new CCSVariable(id, r).setCodePos(location().start.line,location().start.column); }
 
InlineRange
  = _ ":" _ r:CoreRange		{ return r; }

CoreRange
  = a:int ".." b:int	{ return new CCSValueSet("number", a, b).setCodePos(location().start.line,location().start.column); }
  / a:("$"*) ".." b:("$"*) { return new CCSValueSet("string", a.length, b.length).setCodePos(location().start.line,location().start.column); }
  / id:name { return rangeDefinitions.getValue(id); }


channel "channel"
  = first:[a-z] rest:[A-Za-z0-9_]* { return first + rest.join(''); }
  / '\u03c4' { return "i" }
  / '\ud835\uded5' {return "i" }
  / '\ud835\udf0f' { return "i" }
  / '\ud835\udf49' { return "i" }
  / '\ud835\udf83' { return "i" }
  / '\ud835\udfbd' { return "i" }
  
int "integer"
  = "0" { return 0; }
  	/ first:[1-9] rest:[0-9]* { return parseInt(first + rest.join('')); }
 
  
// aexp "expression"
//   = f:(int / action) r:(_ o:("+"/"-"/"*"/"/") _ s:(int/action) { return " " + o + " " + s })* { return f + r.join(""); }
// 
// bexp "boolean expression"
//   = f:(int / action) r:(_ o:("=="/"<"/"<="/">"/">="/"!=") _ s:(int/action) { return " " + o + " " + s })* { return f + r.join(""); }


_ "whitespace"
  = [' '\n\r\t] _               {}
  / '#' inlineComment           {}
  / '//' inlineComment			{}
  / '(*' commentA _		{}
  / __             				{}   


__ "inline whitespace"
  = ([' '\t] __               {}
  / '#' inlineCommentWhitespace           {}
  / '//' inlineCommentWhitespace             {}
  / '(*' commentA __		{})?
 

/*
inlineComment
  = [^\n\r]* [\n\r]+ _			{}

inlineCommentWhitespace
  = [^\n\r]* [\n\r]+ __			{}
  / [^\n\r]* ![^]				{}
*/

inlineComment
  = [^\n\r]* _			{}

inlineCommentWhitespace
  = [^\n\r]* __			{}
  / [^\n\r]* !.				{}


commentA
	= "*)"		{ }
	/ "*" !")" commentA		{}
	/ "(*" commentA commentA		{}
	/ "(" !"*" commentA		{}
	/ f:[^*(] commentA		{}






// Expressions:

expression
 	= ___ result:equalityExpression ___ { return result; }
 	
 	
 	equalityExpression
 		= left:relationalExpression 
 			equal:( ___ op:( '==' / '!=' ) ___ right:relationalExpression 
 				{ return [op, right]; } )*
 		{ 
 			while (equal.length > 0) {
 				var t = equal.shift();
 				left = new CCSEqualityExpression(left, t[1], t[0]).setCodePos(location().start.line,location().start.column);
 			}
 			return left;
 		}
 		
 	
 	relationalExpression
 		= left:concatenatingExpression 
 			relational:( ___ op:( '<''=' / '>''=' / '<' / '>' ) ___ right:concatenatingExpression
 				{ if (op instanceof Array) {op = op.join("");} return [op, right]; } )*
 		{ 
 			while (relational.length > 0) {
 				var t = relational.shift();
 				left = new CCSRelationalExpression(left, t[1], t[0]).setCodePos(location().start.line,location().start.column);
 			}
 			return left;
 		}
 	
 	concatenatingExpression
 		= left:additiveExpression 
 			concat:( ___ '^' ___ right:additiveExpression 
 				{ return right; } )*
 		{ 
 			while (concat.length > 0) {
 				var t = concat.shift();
 				left = new CCSConcatenatingExpression(left, t).setCodePos(location().start.line,location().start.column);
 			}
 			return left;
 		}
 		
 	
 	additiveExpression
 		= left:multiplicativeExpression 
 			addition:( ___ op:( '+' / '-' ) ___ right:multiplicativeExpression 
 				{ return [op, right]; } )*
 		{
 			while (addition.length > 0) {
 				var t = addition.shift();
 				left = new CCSAdditiveExpression(left, t[1], t[0]).setCodePos(location().start.line,location().start.column);
 			}
 			return left;
 		}
 	
 	
 	multiplicativeExpression
 		= left:complementExpression 
 			multiplication:( ___ op:( '*' / '/' / '%' ) ___ right:complementExpression 
 				{ return [op, right]; } )*
 		{
 			while (multiplication.length > 0) {
 				var t = multiplication.shift();
 				left = new CCSMultiplicativeExpression(left, t[1], t[0]).setCodePos(location().start.line,location().start.column);
 			}
 			return left;
 		}
 	
 	
 	complementExpression
 		= "!" ___ e:complementExpression	{ return new CCSComplementExpression(e).setCodePos(location().start.line,location().start.column); }
 		/ e: primaryExpression 				{ return e; }
 	
 	
 	primaryExpression
 		= exp_boolean
 		/ exp_integer
 		/ exp_string
 		/ exp_identifier
 		/ "(" ___ equality:equalityExpression ___ ")" 
 			{ return equality; }
 	
 	exp_identifier "identifier"
 	  = first:[a-z_$] rest:[A-Za-z0-9_$]* 
 	  	{ return new CCSVariableExpression(first + rest.join('')).setCodePos(location().start.line,location().start.column); }
 	
 	exp_boolean "boolean literal"
 		= 'true' { return new CCSConstantExpression(true).setCodePos(location().start.line,location().start.column); }
 		/ 'false' { return new CCSConstantExpression(false).setCodePos(location().start.line,location().start.column); }
 	
 	exp_integer "integer literal"
 		= minus:('-')? digits:[0-9]+ { return new CCSConstantExpression(parseInt((minus ? minus : "") + digits.join(""))).setCodePos(location().start.line,location().start.column); }
 		
 	
 	exp_string "string literal"
 	    =	'"' 
 	        s:(   exp_escapeSequence
 	        /   [^"]       
 	        )* 
 	        '"' { return new CCSConstantExpression((s.join ? s.join("") : "")).setCodePos(location().start.line,location().start.column); }
 	
 	exp_escapeSequence 
 	    =   '\\' res:(
 	                 't'  	{ return '\t'; }
 	             /   'n'  	{ return '\n'; }
 	             /   'r'  	{ return '\r'; }
 	             /   '"'  	{ return '"'; }
 	             /   '\\'  	{ return '\\'; }
 	             ) 
 	        { return res; }
 	
 	___ "whitespace"
 	  = ' '*               {}
 	
 	