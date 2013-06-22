
# - Global initializer
CCSProcessCreateView = (stepView, process, needsBrackets) -> 
	if process instanceof Prefix then new CCSPrefixView(stepView, process)
	else if process instanceof Condition then new CCSConditionView(stepView, process)
	else if process instanceof Stop then new CCSStopView(stepView, process)
	else if process instanceof Exit then new CCSExitView(stepView, process)
	else if process instanceof ProcessApplication then new CCSProcessApplicationView(stepView, process)
	else if process instanceof ProcessApplicationProxy then new CCSProcessApplicationProxyView(stepView, process)
	else if process instanceof Choice then new CCSChoiceView(stepView, process, needsBrackets)
	else if process instanceof Parallel then new CCSParallelView(stepView, process, needsBrackets)
	else if process instanceof Sequence then new CCSSequenceView(stepView, process, needsBrackets)
	else if process instanceof Restriction then new CCSRestrictionView(stepView, process, needsBrackets)
	else throw new Error("Process view could not be created for unknown process!")


# -- CCSProcessView (abstract class)
class CCSProcessView
	constructor: (@stepView, @process, @needsBrackets, @subviews...) ->
	setPossibleSteps: (steps) -> v.setPossibleSteps(steps) for v in @subviews
	setPossibleSyncableSteps: (steps) -> v.setPossibleSyncableSteps(steps) for v in @subviews
	removeView: -> @span?.parentNode.removeChild(@span)
	

# - CCSStopView
class CCSStopView extends CCSProcessView
	constructor: (stepView, stop) -> super stepView, stop, false
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		t = document.createTextNode("0")
		@span.appendChild(t)
		return @span


# - CCSExitView
class CCSExitView extends CCSProcessView
	constructor: (stepView, exit) -> super stepView, exit, false
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		@a = document.createElement("A")
		@span.appendChild(@a)
		@a.setAttribute("HREF", "javascript:void(0)")
		@_setEnabled(false)
		t = document.createTextNode("1")
		@a.appendChild(t)
		return @span
	_setEnabled: (enabled) ->
		return @a?.setAttribute("CLASS", "ccs_step") if enabled
		@a?.setAttribute("CLASS", "ccs_step disabled")
	setPossibleSteps: (steps) -> 
		@steps = []
		(
			@steps.push([p,s]) if p == @process
		) for [p, s] in steps
		@_setEnabled(@steps.length > 0)
	setPossibleSyncableSteps: (steps) -> @setPossibleSteps steps


# - CCSProcessApplicationView
class CCSProcessApplicationView extends CCSProcessView	#ToDo: Possible steps badge!
	constructor: (stepView, application) -> super stepView, application, false
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		sup = document.createElement("SUP")
		@span.appendChild(sup)
		@toggleA = document.createElement("A")
		sup.appendChild(@toggleA)
		@toggleA.setAttribute("HREF", "javascript:void(0)")
		@toggleA.setAttribute("CLASS", "ccs_toggle_process")
		@toggleA.innerText = "\u21e3"
		@toggleA.__this = @
		@toggleA.addEventListener("click", @_handleClick)
		@_setEnabled(false)
		t = document.createTextNode(@process.toString())
		@span.appendChild(t)
		return @span
	_setEnabled: (enabled) ->
		return @toggleA.style.display = "inline" if enabled
		@toggleA.style.display = "none"
	setPossibleSteps: (steps) -> 
		@steps = []
		(
			@steps.push([p,s]) if p == @process
		) for [p, s] in steps
		@_setEnabled(@steps.length > 0)
	_handleClick: (event) -> this.__this.stepView._handleProcessExtension(this.__this)

# - CCSProcessApplicationProxyView
class CCSProcessApplicationProxyView extends CCSProcessView
	constructor: (stepView, proxy, needsBrackets) ->
		super stepView, proxy, false, CCSProcessCreateView(stepView, proxy.subprocess, needsBrackets)
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		sup = document.createElement("SUP")
		@span.appendChild(sup)
		@toggleA = document.createElement("A")
		sup.appendChild(@toggleA)
		@toggleA.setAttribute("HREF", "javascript:void(0)")
		@toggleA.setAttribute("CLASS", "ccs_toggle_process")
		@toggleA.innerText = "\u21e1"
		@toggleA.__this = @
		@toggleA.addEventListener("click", @_handleClick)
		@_setEnabled(false)
		@subSpan = @subviews[0].getNode()
		@span.appendChild(@subSpan)
		return @span
	_setEnabled: (enabled) ->
		return @toggleA.style.display = "inline" if enabled
		@toggleA.style.display = "none"
	setPossibleSteps: (steps) -> 
		super steps
		@steps = []
		(
			@steps.push([p,s]) if p == @process
		) for [p, s] in steps
		@_setEnabled(@steps.length > 0)
	_handleClick: (event) -> this.__this.stepView._handleProcessCollapse(this.__this)


# - CCSPrefixView
class CCSPrefixView extends CCSProcessView
	constructor: (stepView, prefix) -> 
		super stepView, prefix, false, CCSProcessCreateView(stepView, prefix.process)
		@allowsInternalActions = true
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		@a = document.createElement("A")
		@span.appendChild(@a)
		@a.setAttribute("HREF", "javascript:void(0)")
		@a.__this = @
		@_setEnabled(false)
		t = document.createTextNode(@process.action.toString())
		@a.appendChild(t)
		t = document.createTextNode(".")
		@span.appendChild(t)
		@subSpan = @subviews[0].getNode()
		@span.appendChild(@subSpan)
		return @span
	_setEnabled: (enabled) ->
		return if !@a
		if enabled
			@a.setAttribute("CLASS", "ccs_step")
			@a.addEventListener("click", @_handleClick)
		else
			@a.setAttribute("CLASS", "ccs_step disabled")
			@a.removeEventListener("click", @_handleClick)
	setPossibleSteps: (steps) -> 
		@steps = []
		(
			@steps.push([p,s]) if p == @process and (@allowsInternalActions or s.action.channel != CCSInternalChannel)
		) for [p,s] in steps
		@_setEnabled(@steps.length > 0)
	setPossibleSyncableSteps: (steps) -> @setPossibleSteps steps
	_handleClick: (event) -> this.__this.stepView._handleActionSelection(this.__this)


# - CCSConditionView
class CCSConditionView extends CCSProcessView
	constructor: (stepView, condition) -> super stepView, condition, false, CCSProcessCreateView(stepView, condition.process)
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		t = document.createTextNode("when (#{@process.expression.toString()}) ")
		@span.appendChild(t)
		@subSpan = @subviews[0].getNode()
		@span.appendChild(@subSpan)
		return @span


# - CCSChoiceView
class CCSChoiceView extends CCSProcessView
	constructor: (stepView, choice, needsBrackets) -> 
		lv = CCSProcessCreateView(stepView, choice.left, choice.needsBracketsForSubprocess(choice.left))
		rv = CCSProcessCreateView(stepView, choice.right, choice.needsBracketsForSubprocess(choice.left))
		super stepView, choice, needsBrackets, lv, rv
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		@leftSpan = @subviews[0].getNode()
		@rightSpan = @subviews[1].getNode()
		@span.appendChild(@leftSpan)
		t = document.createTextNode(" + ")
		@span.appendChild(t)
		@span.appendChild(@rightSpan)
		return @span


# - CCSParallelView
class CCSParallelView extends CCSProcessView
	constructor: (stepView, parallel, needsBrackets) -> 
		lv = CCSProcessCreateView(stepView, parallel.left, parallel.needsBracketsForSubprocess(parallel.left))
		rv = CCSProcessCreateView(stepView, parallel.right, parallel.needsBracketsForSubprocess(parallel.left))
		super stepView, parallel, needsBrackets, lv, rv
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		@span.appendChild(document.createTextNode("(")) if @needsBrackets
		@leftSpan = @subviews[0].getNode()
		@rightSpan = @subviews[1].getNode()
		@span.appendChild(@leftSpan)
		t = document.createTextNode(" | ")
		@span.appendChild(t)
		@span.appendChild(@rightSpan)
		@span.appendChild(document.createTextNode(")")) if @needsBrackets
		return @span


# - CCSSequenceView
class CCSSequenceView extends CCSProcessView
	constructor: (stepView, sequence, needsBrackets) -> 
		super stepView, sequence, needsBrackets, CCSProcessCreateView(stepView, sequence.left), CCSProcessCreateView(@stepView, sequence.right)
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		@leftSpan = @subviews[0].getNode()
		@rightSpan = @subviews[1].getNode()
		@span.appendChild(@leftSpan)
		t = document.createTextNode(" ; ")
		@span.appendChild(t)
		@span.appendChild(@rightSpan)
		return @span


# - CCSRestriction
class CCSRestrictionView extends CCSProcessView
	constructor: (stepView, restriction, needsBrackets) ->
		super stepView, restriction, needsBrackets, CCSProcessCreateView(stepView, restriction.process)
	getNode: ->
		return @span if @span
		@span = document.createElement("SPAN")
		@subSpan = @subviews[0].getNode()
		@span.appendChild(@subSpan)
		t = document.createTextNode(" \\ {#{(a.toString() for a in @process.restrictedActions).join ", "}}")
		@span.appendChild(t)
		return @span









# - CCSStepView
class CCSStepView
	constructor: (@ccs) ->
		@syncableSteps = null		# if set some prefix or exit actions may be disabled
	getNode: ->
		return @p if @p
		@p = document.createElement("P")
		@p.setAttribute("CLASS", "ccs_view")
		@system = @ccs.system.copy()
		@rootView = CCSProcessCreateView(@, @system)
		@p.appendChild(@rootView.getNode())
		@_updatePossibleSteps()
		return @p
		
		
	_setPossibleSteps: (steps) ->
		@steps = ((
			(([p, s]) for p in s.getLeaveProcesses())
		) for s in steps).concatChildren()		# list of tuples: leave process x root action
		@rootView.setPossibleSteps @steps
	_setPossibleSyncableSteps: (steps) ->		# process extension and collapse ignore this call
		@syncableSteps = ((
			(([p, s]) for p in s.getLeaveProcesses())
		) for s in steps).concatChildren()		# list of tuples: leave process x root action
		@rootView.setPossibleSyncableSteps @syncableSteps
	
	_handleActionSelection: (@prefixView) ->
		if @syncableSteps
			@prefixView.allowsInternalActions = true
			@syncableSteps = null
			if @prefixView.steps.length != 1
				console.warn "Prefix view has more than one possible step: " + @prefixView.steps
			@system = @prefixView.steps[0][1].perform()
			@_checkSystemChanges()
		else
			@prefixView.allowsInternalActions = false
			@_setPossibleSyncableSteps (s for [p,s] in @prefixView.steps)
	_handleProcessExtension: (@pappView) ->
		if @pappView.steps.length != 1
			console.warn "Process application view doesn't have one possible step: " + @pappView.steps
		@system = @pappView.steps[0][1].perform()
		@_checkSystemChanges()
	_handleProcessCollapse: (@proxy) ->
		if @proxy.steps.length != 1
			console.warn "Process application proxy view doesn't have one possible step: " + @proxy.steps
		@system = @proxy.steps[0][1].perform()
		@_checkSystemChanges()
	
	_checkSystemChanges: ->
		#return @rootView._checkSystemChanges() if @system == @rootView.process
		@rootView.removeView()
		@rootView = CCSProcessCreateView(@, @system)
		@p.appendChild(@rootView.getNode())
		@_updatePossibleSteps()
	_updatePossibleSteps: ->
		return if !@rootView
		@_setPossibleSteps @system.getPossibleSteps()
		@rootView?.setPossibleSyncableSteps @syncableSteps if @syncableSteps














