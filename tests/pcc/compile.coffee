PC = require("PseuCo")
PCC = require("CCSCompiler")


describe "PseuCo parser", ->
	programs = testCases
	testProgram = (i) ->				 # "it" must be wrapped in a function
		it "should parse and compile \"#{i}\"", ->
			#console.log "\n#{i}:"
			tree = null
			try
				tree = PC.parser.parse(programs[i].code)
			catch e
				e2 = new Error("Line #{e.line}, column #{e.column}: #{e.message}")
				e2.name = e.name
				throw e2
			expect(tree instanceof PC.Node).toBe(true)
			programs[i].tree = tree
		
		it "should check types for \"#{i}\"", ->
			try
				programs[i].tree.getType()
			catch e
				e2 = new Error("Line #{e.line}, column #{e.column}: #{e.message}")
				e2.name = e.name
				throw e2
			
			
		it "should compile \"#{i}\" to CCS", ->
			compiler = new PCC.Compiler(programs[i].tree)
			programs[i].ccs = compiler.compileProgram()
		
		#it "should be able to generate traces for #{i}", ->
			#programs[i].ccs.getTraces(false, 20)
			

	for i of programs
		testProgram(i)
	null