###
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
###




###
	This class represents PseuCo's types.
	May be partly incomplete as type checking is not yet completely supported by the PseuCo tree.
###

class PCTType
	constructor: (@kind) ->
		throw new Error("Unknown kind of type!") if @kind < 0 || @kind > 14
	isEqual: (type) ->
		type.kind == @kind
	toString: ->
		switch @kind
			when PCTType.INT then "int"
			when PCTType.BOOL then "bool"
			when PCTType.STRING then "string"
			when PCTType.CHANNEL then "channel"
			when PCTType.ARRAY then "array"
			when PCTType.MONITOR then "monitor"
			when PCTType.STRUCTURE then "struct"
			when PCTType.MUTEX then "mutex"
			when PCTType.CONDITION then "condition"
			when PCTType.PROCEDURE then "procedure"
			when PCTType.TYPE then "type"
			when PCTType.MAINAGENT then "mainAgent"
			when PCTType.AGENT then "agent"
			when PCTType.WILDCARD then "wildcard"
			else "void"

PCTType.VOID = 0;
PCTType.BOOL = 1;
PCTType.INT = 2;
PCTType.STRING = 3;

PCTType.CHANNEL = 4;
PCTType.ARRAY = 5;
PCTType.MONITOR = 6;
PCTType.STRUCT = 7;

PCTType.MUTEX = 8;
PCTType.CONDITION = 9;

PCTType.PROCEDURE = 10;
PCTType.TYPE = 11;
PCTType.MAINAGENT = 12;

PCTType.AGENT = 13;

PCTType.WILDCARD = 14;



class PCTArrayType extends PCTType
	constructor: (@elementsType, @capacity) ->
		super PCTType.ARRAY
	isEqual: (type) ->
		capacityFulfilled = type.capacity == @capacity || @capacity == 0 || type.capacity == 0
		type.kind == @kind and capacityFulfilled and @elementsType.isEqual(type.elementsType)
	toString: -> "#{@elementsType.toString()}[#{@capacity}]"


class PCTChannelType extends PCTType
	constructor: (@channelledType, @capacity) ->
		super PCTType.CHANNEL
	isEqual: (type) ->
		@kind == type.kind and @capacity == type.capacity and @channelledType.isEqual(type.channelledType)
	isAssignableTo: (type) ->	# is this assignable to type?
		@kind == type.kind and (@capacity == type.capacity or type.capacity == 0) and @channelledType.isEqual(type.channelledType)
	getApplicableCapacity: -> if @capacity == PCChannelType.CAPACITY_UNKNOWN then 0 else @capacity
	toString: ->
		if @capacity == PCChannelType.CAPACITY_UNKNOWN
			"handshake #{@channelledType.toString()} #{super}"
		else
			"#{@channelledType.toString()} #{super} of capacity #{@capacity}"


class PCTClassType extends PCTType
	constructor: (isMonitor, @identifier) ->
		super (if isMonitor then PCTType.MONITOR else PCTType.STRUCT)
	isMonitor: -> @kind == PCTType.MONITOR
	isEqual: (type) ->
		@kind == type.kind and @identifier == type.identifier
	toString: -> "#{super} #{@identifier}"

class PCTProcedureType extends PCTType
	constructor: (@returnType, @argumentTypes) ->
		super PCTType.PROCEDURE
	isEqual: (type) ->
		return false if type.argumentTypes.length != @argumentTypes
		(return false if not type.argumentTypes[i].isEqual(@argumentTypes[i])) for i in [0...@argumentTypes.length] by 1
		type.returnType.isEqual(@returnType)
	toString: ->
		args = (t.toString() for t in @argumentTypes).join(" x ")
		"#{@returnType.toString()} -> (#{args})"
		
		
class PCTTypeType extends PCTType
	constructor: (@type) ->
		super PCTType.TYPE
	isEqual: (type) ->	@kind == type.kind and @type.isEqual(type.type)
		
		
		
		
	
