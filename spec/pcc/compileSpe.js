var testCases = {"3-syncs":{"code":"intchan ch0,ch1,ch2;\r\nboolchan done;\r\n\r\nvoid who(intchan left, intchan right, boolchan dne, int id) {\r\n\tint v;\r\n\tselect {\r\n\tcase v = <? right:\r\n\t\tprintln(\"Agent\" + id + \"is receiving from his right neighbour the value \" + v);\r\n\tcase left <! id:\r\n\t\tprintln(\"Agent\" + id + \"is sending to his left neighbour his id \" + id);\r\n\t}\r\n\tdne <! true;\r\n}\r\n\r\nmainAgent {\r\n\tstart who(ch0, ch1, done, 1);\r\n\tstart who(ch1, ch2, done, 2);\r\n\tstart who(ch2, ch0, done, 3);\r\n\t<? done;\r\n\t<? done;\r\n\tprintln(\"....... now\");\r\n\tprintln(\"....... terminating\");\r\n}\r\n\r\n"},"B-first":{"code":"int mid, fin;\r\nintchan cc;\r\n \r\nvoid factorial(int z, intchan c){ \r\n   int j, n;         \r\n   n= 1;\r\n   for ( j = z; j > 0 ; j-- ){\r\n      n= n*j; \r\n   }      \r\n   c <! n; // Ich sende, was rauskommt.\r\n}\r\n\r\nmainAgent{\r\n   agent a1 = start factorial(3, cc);         // Ich lasse  einen Agenten von der Leine.\r\n   println(\"Der erste Agent arbeitet fuer mich.\"); \r\n   mid = <? cc;                         // Mal sehen was der ausrechnet.\r\n   agent a2 = start factorial(mid, cc);       // Und noch einen.\r\n   println(\"Der zweite Agent arbeitet fuer mich.\"); \r\n   fin = <? cc;                         // Mal sehen was der draus macht.\r\n   println(\"Die Fakultaet von der Fakultaet von 3 ist \" + fin + \".\");\r\n}\r\n\r\n"},"B-fourth":{"code":"intchan10 cc;\r\nintchan10 dd;\r\n \r\nvoid factorial(intchan d, intchan c){ \r\n   int j, n, z;\r\n   while (true) {  // Wie waers mit ewigem Leben?\r\n      z = <? d;    // Womit soll ich rechnen?\r\n      n=1;\r\n      for (j = z ; j > 0 ; j--){\r\n         n= n*j; \r\n      }     \r\n   c <! n; // Ich sende, was rauskommt.\r\n   }       // Und fange wieder von vorne an.\r\n}\r\n\r\nmainAgent{\r\n   int j;\r\n   agent[4] a = {\r\n   \t\tstart factorial(dd, cc),\r\n   \t\tstart factorial(dd, cc),\r\n   \t\tstart factorial(dd, cc),\r\n   \t\tstart factorial(dd, cc)\r\n   };\r\n   for (j=1; j<=8 ; j++){\r\n       dd <! j;                             // Hier gibt's Arbeit.\r\n   }                                        // Jetzt ham alle viel zu tun.\r\n   for (j=1; j<=8 ; j++){\r\n       int res = <? cc;                         // Hier sammel ich die Ergebnisse ein.\r\n       println(\"Die Fakultaet von \" + j + \" ist \" + res + \".\"); \r\n   }  \r\n}\r\n\r\n\r\n"},"B-second":{"code":"int mid, fin;\r\nintchan dd;\r\nintchan cc;\r\n \r\nvoid factorial(intchan c){ \r\n   int j, n=1;         \r\n   int z = <? dd; // Womit soll ich rechnen?\r\n   for (j = z; j > 0 ; j--){\r\n      n= n*j; \r\n   }       // Hier ist die Arbeit erledigt.\r\n   c <! n; // Ich sende, was rauskommt.\r\n}\r\n\r\nmainAgent{\r\n   agent a1 = start factorial(cc);        // Ich lasse einen Agenten loslegen.\r\n   agent a2 = start factorial(cc);        // Und noch einen.\r\n   dd <! 3;                         // Werfen wir mal was zu rechnen aus.\r\n   mid = <? cc;                     // Mal sehen was einer ausrechnet.\r\n   dd <! mid;                       // Das reichen ich weiter.\r\n   fin = <? cc;                     // Mal sehen, was der andere draus macht.\r\n   println(\"Die Fakultaet von der Fakultaet von 3 ist \" + fin + \".\"); \r\n}\r\n\r\n"},"B-third":{"code":"int fin;\r\nintchan cc;\r\n \r\nvoid factorial(intchan c){ \r\n   int n=1;         \r\n   int z = <? c;                // Womit soll ich rechnen?\r\n   for (int j = z ; j > 0 ; j--){\r\n      n= n*j;    \r\n   }                            // Hier ist die Arbeit erledigt.\r\n   c <! n;                      // Ich sende, was rauskommt.\r\n}\r\n\r\nmainAgent{\r\n   agent a1 = start factorial(cc);    // Ich lasse einen Agenten loslegen.\r\n   agent a2 = start factorial(cc);    // Und noch einen.\r\n   cc <! 3;   \r\n   fin = <? cc;                 // Mal sehen was der draus macht.\r\n   println(\"Die Fakultaet von der Fakultaet von 3 ist \" + fin + \".\"); \r\n}\r\n\r\n"},"Kanal3":{"code":"monitor Kanal3{\r\n\r\n   int[3] n;\r\n   int used = 0; \r\n\r\n   condition platzIstFrei with (used < 3);\r\n   condition datumIstDa with (used > 0);\r\n\r\n   void put (int x){\r\n      waitForCondition platzIstFrei;\r\n      n[used] = x;\r\n      used++;\r\n      signal datumIstDa;\r\n   }\r\n\r\n   int get (){\r\n      waitForCondition datumIstDa;\r\n      int temp = n[0];\r\n      used--;\r\n      for (int j=1; j <= used;j++){\r\n         //n[j-i]=n[j];\r\n         n[j-1]=n[j];\r\n      }\r\n      signal platzIstFrei;\r\n      return temp;\r\n   }\r\n}\r\n\r\nmainAgent {}\r\n"},"concurrentCounting":{"code":"int n;\n\nvoid zaehler(){\n   int loop;\n   for (loop = 0; loop < 5; loop++){\n      n = n - 1;\n   }\n}\n\nmainAgent {\n   n = 10;\n\n   agent a1 = start zaehler();\n   agent a2 = start zaehler();\n   join (a1);\n   join (a2);\n   println(\"Der Wert ist \" + n); \n}\n\n"},"concurrentCountingCoarse":{"code":"int n;\nmutex guard_n;                        // Sicherer Raum\n\nvoid zaehler(){\n   int loop;\n   lock guard_n;                    // Sicheren Raum betreten\n   for (loop = 0; loop < 5; loop++){\n      n = n - 1;\n   }\n   unlock guard_n;                    // Sicheren Raum verlassen\n}\n\nmainAgent{\n   n = 10;\n\n   agent a1 = start zaehler();\n   agent a2 = start zaehler();\n   join (a1);\n   join (a2);\n   println(\"Der Wert ist \" + n); \n}\n"},"concurrentCountingFine":{"code":"int n;\nmutex guard_n;                        // Sicherer Raum\n\nvoid zaehler(){\n   int loop;\n   int temp;\n   for (loop = 0; loop < 5; loop++){\n      lock guard_n;                    // Sicheren Raum betreten\n      temp = n;                                            // Gemeinsame Variable geschuetzt lesen.\n      unlock guard_n;                    // Sicheren Raum verlassen\n      temp = temp - 1;\n      lock guard_n;                    // Sicheren Raum betreten\n      n = temp;                                            // Gemeinsame Variable geschuetzt schreiben.\n      unlock guard_n;                    // Sicheren Raum verlassen\n  }\n}\n\nmainAgent{\n   n = 0;\n\n   agent a1 = start zaehler();\n   agent a2 = start zaehler();\n   join (a1);\n   join (a2);\n   println(\"Der Wert ist \" + n); \n}\n"},"concurrentCountingLocks":{"code":"int n;\nmutex guard_n;                        // Sicherer Raum\n\nvoid zaehler(){\n   int loop;\n   for (loop = 0; loop < 5; loop++){\n      lock guard_n;                    // Sicheren Raum betreten\n      n = n - 1;\n     unlock guard_n;                    // Sicheren Raum verlassen\n   }\n}\n\nmainAgent{\n   n = 10;\n\n   agent a1 = start zaehler();\n   agent a2 = start zaehler();\n   join (a1);\n   join (a2);\n   println(\"Der Wert ist \" + n); \n}\n"},"countDown":{"code":"intchan read;\r\nintchan write;\r\nboolchan jn;\r\n\r\nvoid cell ( intchan rd , intchan wt , int init ) {\r\n   int v = init ; \r\n   while ( true ) {\r\n      select {\r\n         case rd <! v: \r\n             println (\"... Aktueller Wert: \", v);\r\n         case v = <? wt: \r\n             println (\"... Neuer Wert: \", v);\r\n      }\r\n   }\r\n}\r\n\r\nvoid zaehler (){\r\n   int loop ;\r\n   for ( loop = 0; loop < 5; loop ++){\r\n       write  <! ( (<? read) - 1);\r\n   }\r\n   jn <! true;\r\n}\r\n\r\nmainAgent{\r\n   start cell (read, write, 10); \r\n   agent a1 = start zaehler ();\r\n   agent a2 = start zaehler (); \r\n   <? jn;\r\n   <? jn;\r\n   println (\"Der Wert ist \" + (<?read));\r\n}"},"countDownLocked":{"code":"intchan read;\r\nintchan write;\r\nboolchan jn;\r\nboolchan1 guard;\r\nvoid cell ( intchan rd , intchan wt , int init ) {\r\n   int v = init ;\r\n   while ( true ) {\r\n      select {\r\n         case rd <! v:\r\n              println (\"... Aktueller Wert: \", v);\r\n         case v = <? wt:\r\n              println (\"... Neuer Wert: \", v);\r\n      }\r\n   }\r\n} \r\nvoid mpLock(boolchan1 g){\r\n   g <! true;\r\n} \r\nvoid mpUnlock(boolchan1 g){\r\n   <? g;\r\n}\r\n\r\nvoid zaehler (){\r\n   int loop ;\r\n   for ( loop = 0; loop < 5; loop ++){\r\n       mpLock(guard);\r\n       write  <! ( (<? read) - 1);\r\n       mpUnlock(guard);\r\n   }\r\n   jn <! true;\r\n}\r\n\r\nmainAgent{\r\n   start cell (read, write, 10); \r\n   agent a1 = start zaehler ();\r\n   agent a2 = start zaehler (); \r\n   <? jn;\r\n   <? jn;\r\n   println (\"Der Wert ist \" + (<?read));\r\n}\r\n\r\n\r\n"},"eighth":{"code":"intchan10 buff;\n  \nvoid produce(intchan out, string id){ \n   while (true) {\n\t\tint p = 1;\n       // ...  Nehme mir Zeit um zu produzieren.\n       println(\"Erzeuger \" + id + \" hat \" + p + \" produziert.\");\n       out <! p;\n   }\n}\n  \nvoid consume(intchan in, string id){ \n   while (true) {\n\t\tint c = 2;\n       c = <? in;\n       // ...  Brauche Zeit um zu konsumieren.\n       println(\" Verbraucher \" + id + \" hat \" + c + \" konsumiert.\");\n   }\n}\n \nmainAgent{\n   start produce(buff, \"1\"); // Ein Erzeuger. \n   start produce(buff, \"2\"); // Zwei Erzeuger. \n   start produce(buff, \"3\"); // Drei Erzeuger. \n   \n   start consume(buff, \"A\"); // Ein Verbraucher. \n   start consume(buff, \"B\"); // Zwei Verbraucher. \n   start consume(buff, \"C\"); // Drei Verbraucher. \n   start consume(buff, \"D\"); // Vier Verbraucher. \n}"},"eleventh-executable":{"code":"intchan100[4] w;\n\nint nextPseudoRand (int y) {\n   y = (y+1) * 11173 % 11939;\n   return (y>0?y:-y);\n}\n\nvoid remember(int x){\n}\n\nbool alreadySeen(int x){\nreturn false;\n}\n\nint[10] post(int x){\n   int[10] res;\n   for (int j = 0 ; j <10; j++){\n      x = nextPseudoRand(x);\n      res[j] = x % 10000 ;\n   }\n   return res;\n}\n\nvoid search (int id, boolchan r) {\n   int curr;\n   int[10] nxt;\n   bool found = false;\n   int i = 0;\n   int v;\n   while (!(found)){\n      curr = <? w[id];\n      found = (curr == 13);\n      i++;\n      println(i + \". Agent \" + id + \" bearbeitet Knoten \" + curr);\n      if (!alreadySeen(curr)){\n         remember(curr);\n         nxt = post(curr);\n         for (int j=0 ; j < 10; j++){\n            v = nxt[j];\n            w[v % 4] <! v;\n         }\n      }\n   }\n   r <! true;\n}\n \nmainAgent{\n   boolchan res;\n   for (int j=0; j<4 ; j++){\n       start search(j, res);  // Ich lasse vier Agenten loslegen.\n   }\n   w[0] <! 0; // Einer bekommt den initialen Knoten\n\n   <? res; // Sagt mir jemand Bescheid?\n   \n   println(\"Ja, der Knoten 13 ist erreichbar.\");\n}\n\n"},"fifth":{"code":"intchan10 cc;\r\nintchan10 dd;\r\nboolchan ff; \r\n \r\nvoid factorial(boolchan f, intchan d, intchan c){ \r\n   int j,n,z; \r\n   bool run = true;  \r\n   while (run) { // Ewiges Leben?\r\n      select {\r\n         case  <? f:{ // Aha, Zeit aufzuhoeren.\r\n            run = false;\r\n         } \r\n         case z = <? d:{ // Aha, Weitermachen.\r\n            n=1;\r\n            for (j = z; j > 0; j--){\r\n               n= n*j; \r\n            }   \r\n            c <! n; // Ich sende, was rauskommt.\r\n         }          // Und fange wieder von vorne an.\r\n      }\r\n\t}\r\n    println(\"Kein ewiges Leben\"); \r\n}\r\n\r\nmainAgent{\r\n   int j;\r\n   agent[4] a = {\r\n   \t\tstart factorial(ff, dd, cc),\r\n   \t\tstart factorial(ff, dd, cc),\r\n   \t\tstart factorial(ff, dd, cc),\r\n   \t\tstart factorial(ff, dd, cc)\r\n   };\r\n   for (j=1; j<=8 ; j++){\r\n       dd <! j;                           // Hier gibt's Arbeit.\r\n   }                                      // Jetzt ham alle viel zu tun.\r\n   int res;\r\n   for (j=1; j<=8 ; j++){\r\n       res = <? cc;                         // Hier sammel ich die Ergebnisse ein.\r\n       println(\"Eine der Fakultaeten von 1 bis 8 ist \" + res + \".\"); // Ui.\r\n   }  \r\n   for (j=0; j<4 ; j++){\r\n       ff <! true;                        // Jetzt ist Schluss fuer euch.\r\n   }                                        \r\n}\r\n\r\n\r\n"},"first":{"code":"mainAgent{\r\n   int j, n; \r\n   n = 1;        \r\n   for (j = 5; j > 0 ; j--){\r\n      n = n*j;\r\n   }                                       \r\n   println(\" Die Fakultaet von 5 ist \" + n + \".\"); // Ich verrate was rauskommt.\r\n}\t"},"fourth":{"code":"\r\nvoid factorial(int z){ \r\n   int j, n = 1;         \r\n   for (j = z ;  j > 0 ; j--){\r\n      n= n*j; \r\n   }  \r\n   println(\"Die Fakultaet von \"+ z +\" ist \" + n + \".\"); \r\n}\r\n\r\nmainAgent{\r\n   agent a1 = start factorial(3);       \r\n   agent a2 = start factorial(5);        \r\n}\r\n\r\n\r\n"},"lock-free-naive-queue":{"code":"monitor Kanal20P_pseudo_lock_free { \n\nint[20] n;  // nicht direkt zugreifbar, dies ist die gemeinsame Ressource  \nint used = 0; // nicht direkt zugreifbar, zaehlt die belegten Kanalplaetze \n\ncondition platzIstFrei with used<20; // nicht direkt zugreifbar, entspricht der Bedingung \"used < 20\"\ncondition datumIstDa with used>0;   // nicht direkt zugreifbar, entspricht der Bedingung \"used > 0\"\n\n\nvoid put(int x){\n   waitForCondition platzIstFrei;    // Entspannt warten, bis Platz frei.\n   n[used] = x;                // Verwende die Monitor-Operation von PrimOderNicht\n   used++;\n   signal datumIstDa;      // Uebrigens, jetzt ist ein Datum da.\n}\n\nint get(){\n   int temp; \n   waitForCondition datumIstDa; // Entspannt warten, bis Datum da.\n   temp = n[0];      \n   for (int j=1; j < used; j++){\n         n[j-1]=n[j];\n   }\n   used--;\n   signal platzIstFrei;  // Uebrigens, jetzt ist ein Plaetzchen frei.\n   return temp; // TODO: \n}\n\n}\n\nmainAgent {}"},"mitUndOhneLock":{"code":"mutex guard_n; \nint n;\n \n void zaehlerMitLock(){\n  for (int loop = 0; loop < 10; loop++){\n    lock guard_n;                    // Sicheren Raum betreten\n    n = n + 1;\n    lock guard_n;                    // Sicheren Raum verlassen\n  }\n}\n\nvoid zaehlerOhneLock(){\n  for (int loop = 0; loop < 10; loop++){\n    n = n + 1;\n  }\n}\n\nmainAgent {}\n"},"monitorAtomareGanzeZahl":{"code":"monitor AtomareGanzeZahl { \n\nint n;  // nicht direkt zugreifbar, dies ist das gemeinsame Datum  \n\nvoid set(int x){\n   n = x;\n}\n\nint get(){\n   return n;\n}\n\nvoid increment(){\n   n = n + 1;\n}\n\nvoid decrement(){\n   n = n - 1;\n}\n\nbool compareAndSet(int expected, int v){\n   bool temp = false; \n   if (n == expected) {\n      n = v; \n      temp = true;\n   }\n   return temp;  \n}\n\n}\n\nmainAgent {}"},"monitorKanal-3-Condition":{"code":"monitor Kanal3 { \n\n   int[3] n;  // nicht direkt zugreifbar, dies ist die gemeinsame Ressource  \n   int used = -1; // nicht direkt zugreifbar, zaehlt die belegten Kanalplaetze \n\n   condition platzIstFrei with (used < 2); // nicht direkt zugreifbar, entspricht der Bedingung \"used < 2\"\n   condition datumIstDa with (used >= 0);   // nicht direkt zugreifbar, entspricht der Bedingung \"used >= 0\"\n\n\n   void put(int x){\n     waitForCondition platzIstFrei;\n     n[used] = x;\n     used++;\n     signal datumIstDa;          // Uebrigens, jetzt ist ein Datum da.\n   }\n\n   int get(){\n      int temp; \n      waitForCondition datumIstDa;\n      temp = n[0];\n      for (int j=1; j < used; j++){\n         n[j-1]=n[j];\n      }\n      used--;\n      signal platzIstFrei;         // Uebrigens, jetzt ist ein Plaetzchen frei.\n      return temp; \n   }\n}\n\nmainAgent {}"},"monitorKanal":{"code":"monitor Kanal { \n\n   int n;  // nicht direkt zugreifbar, dies ist die gemeinsame Ressource  \n\n   void put(int x){\n       n = x;\n      }\n   \n\n   int get(){\n           return n; \n}\n}\n\nmainAgent {}"},"monitorKanalCondition":{"code":"monitor Kanal { \n\n   int n;  \n   bool wert_da = false; //Initial ist der Kanal leer\n\n   condition datumIstDa with ( wert_da );\n   condition platzIstFrei with ( !wert_da );\n\n   void put(int x){\n       waitForCondition platzIstFrei;\n       n = x;\n       wert_da = true;\n       signal datumIstDa;\n    }\n\n   int get(){\n       waitForCondition datumIstDa;\n       wert_da = false;\n       signal platzIstFrei;\n       return n;\n   }\n}\n\nmainAgent {}"},"monitorKanalWhile":{"code":"monitor Kanal20 { \n\n   int[20] n;  // nicht direkt zugreifbar, dies ist die gemeinsame Ressource  \n   int used = 0; // nicht direkt zugreifbar, zaehlt die belegten Kanalplaetze \n   condition platzIstFrei with used<20; // nicht direkt zugreifbar, entspricht der Bedingung \"used < 20\"\n   condition datumIstDa with used>0;   // nicht direkt zugreifbar, entspricht der Bedingung \"used > 0\"\n\n  \n   void put(int x){\n      waitForCondition platzIstFrei;     // Entspannt warten, bis Platz frei.\n      n[used] = x;\n      used++;\n      signal datumIstDa;         // Uebrigens, jetzt ist ein Datum da.\n   }\n\n   int get(){\n      int temp; \n      waitForCondition datumIstDa;     // Entspannt warten, bis Datum da.\n      temp = n[0];\n      for (int j=1; j < used; j++){\n         n[j-1]=n[j];\n      }\n      used--;\n      signal platzIstFrei;  // Uebrigens, jetzt ist ein Plaetzchen frei.\n      return temp;  \n   }\n}\n\nmainAgent {}"},"ninth":{"code":"intchan10  t12;\nintchan10  t23;\nboolchan10 k31;\n  \nvoid assemblyB1(intchan in, intchan out, boolchan kan){ \n   int j; bool b; \n   int f(int x){/*...*/ return 1; } // Das soll ich mit dem Ding anstellen.\n   while (true) {\n       b = <? kan;    // Nehme mir ein Kanban.\n       j = <? in;     // Nehme mir ein Ding vom Eingang.\n       j = f(j);      // Dengel ein wenig daran rum.\n       out <! j;      // Und sende es weiter.\n     \n   }\n}\n\nvoid assemblyB2(intchan in, intchan out){ \n   int j; \n   int g(int x){/*...*/ return 1;} // Das soll ich mit dem Ding anstellen.\n   while (true) {\n       j = <? in;     // Nehme mir ein Ding vom Eingang.\n       j = g(j);      // Dengel ein wenig daran rum.\n       out <! j;      // Und sende es weiter.\n     \n   }\n}\n\nvoid assemblyB3(intchan in, intchan out, boolchan kan){ \n   int j; \n   int h(int x){/*...*/ return 1;} // Das soll ich mit dem Ding anstellen.\n   while (true) {\n       j = <? in;       // Nehme mir ein Ding vom Eingang.\n       j = h(j);      // Dengel ein wenig daran rum.\n       kan <! true;   // Gebe ein Kanban ab.     \n       out <!j;       // Und sende das Ding weiter.\n   }\n}\n\n   \nmainAgent{\n   for (int j=0; j<5 ; j++){\n       k31 <! true;     // Ich intialisiere die Kanbans\n   } \n\n   intchan1 in,out;\n   start assemblyB1(in,t12,k31);\n   start assemblyB2(t12,t23);\n   start assemblyB3(t23,out,k31);\n   \n   in <! 17;\n\t// Hier kommt was zu bearbeiten\n   // ...                 Und so weiter\n   }\n\n\n"},"p":{"code":"intchan[3] read;\r\nintchan[3] write;\r\n\r\nboolchan _signalPlatzFrei; \r\nboolchan waitPlatzFrei; \r\nboolchan wantPlatzFrei; \r\nboolchan _signalDatumDa; \r\nboolchan waitDatumDa; \r\nboolchan wantDatumDa; \r\n\r\nvoid cell ( intchan rd , intchan wt , int init ) {\r\n   int v = init ; \r\n   while ( true ) {\r\n      select {\r\n         case rd <! v: \r\n            println (\".\");\r\n         case v = <? wt: \r\n            println (\".\");\r\n      }\r\n   }\r\n}\r\n\r\nvoid initialize(){\r\n   start cell(read[0],write[0],0); \r\n   start cell(read[1],write[1],0);\r\n   start cell(read[2],write[2],0);\r\n \r\n   start chillDaemon(wantDatumDa,waitDatumDa,_signalDatumDa,\"Datum\");\r\n   start chillDaemon(wantPlatzFrei,waitPlatzFrei,_signalPlatzFrei,\"Platz\");\r\n}\r\n\r\nstruct Kanal3{ \r\n   int used = 0; \r\n   boolchan1 guard; \r\n\r\n   void mpLock(boolchan1 g){\r\n      g <! true;\r\n   } \r\n   void mpUnlock(boolchan1 g){\r\n      <? g;\r\n   }\r\n\r\n   void put(int x){\r\n      mpLock(guard);\r\n      while (!(used < 3)){\r\n         wantPlatzFrei <! true;\r\n         mpUnlock(guard);\r\n         <? waitPlatzFrei; \r\n         mpLock(guard);  \r\n      } \r\n      write[used] <! x;\r\n      used++;   \r\n      _signalDatumDa <! true;\r\n      mpUnlock(guard);\r\n   }\r\n\r\n   int get(){\r\n      mpLock(guard);\r\n      while (!(used > 0)){\r\n         wantDatumDa <! true;\r\n         mpUnlock(guard);\r\n         <? waitDatumDa; \r\n         mpLock(guard);  \r\n      } \r\n      int temp = <? read[0];\r\n      used--;\r\n      for (int j=1; j <= used;j++){\r\n         write[j-1] <! (<? read[j]);\r\n      }\r\n      _signalPlatzFrei <! true;\r\n      mpUnlock(guard);\r\n      return temp;\r\n   }\r\n}\r\n\r\nvoid chillDaemon(boolchan want, boolchan waIt, boolchan sIgnal, string name){\r\n   int count = 0; \r\n   while (true) {\r\n      select{\r\n         case <? want:{\r\n            count++;\r\n            println(\"Einer mehr wartet auf \" + name + \".\");\r\n         }\r\n         case <? sIgnal: {\r\n             if (count != 0){\r\n                count--; \r\n                waIt <! false; \r\n                println(\"Einer weniger wartet auf \" + name +\".\");\r\n             }  \r\n         }\r\n      }\r\n   } \r\n} \r\n\r\nKanal3 k;\r\n\r\nvoid produce(int id){ \r\n   while (true) {\r\n       println(\"Erzeuger \" + id + \" hat \" + id + \" produziert.\");\r\n       k.put(id);\r\n   }\r\n}\r\n  \r\nvoid consume(string name){ \r\n   while (true) {\r\n       int c = k.get();\r\n       println(\" Verbraucher \" + name + \" hat \" + c + \" konsumiert.\");\r\n   }\r\n}\r\n\r\nmainAgent{\r\n   initialize();\r\n\r\n   start produce(1); // Ein Erzeuger. \r\n   start produce(2); // Zwei Erzeuger. \r\n   start produce(3); // Drei Erzeuger. \r\n   start produce(4); // Vier Erzeuger. \r\n   start produce(5); // Fuenf Erzeuger. \r\n   \r\n   start consume(\"A\"); // Ein Verbraucher. \r\n   start consume(\"B\"); // Zwei Verbraucher. \r\n   start consume(\"C\"); // Drei Verbraucher. \r\n   start consume(\"D\"); // Vier Verbraucher. \r\n}\r\n\r\n"},"procCallPrimitive":{"code":"    void replace(int i, int x){\n      i = x;\n    }\n\n    mainAgent{\n      int var=0;\n      int val=1;\n      replace(var, val);\n      println (\"var ist \",var,\" und val ist \", val);\n    }\n"},"producer-consumer-MP-encoded-in-SM-encoded-in-MP":{"code":"intchan[3] read;\r\nintchan[3] write;\r\n\r\nstruct Kanal3{ \r\n\r\n   boolchan _signalPlatzFrei; \r\n   boolchan chillPlatzFrei; \r\n   boolchan wantPlatzFrei; \r\n\r\n   boolchan _signalDatumDa; \r\n   boolchan chillDatumDa; \r\n   boolchan wantDatumDa; \r\n\r\n   void cell ( intchan rd , intchan wt , int init, int id) {\r\n      int v = init ; \r\n      while ( true ) {\r\n         select {\r\n            case rd <! v: \r\n               println (\"............. Aktueller Wert:\" + v + \" in Zelle \" + id + \".\");\r\n            case v = <? wt: \r\n               println (\"............. Neuer Wert:\" + v + \" in Zelle \" + id + \".\");\r\n         }\r\n      }\r\n   }\r\n\r\n   void chillDaemon(boolchan want, boolchan chill, boolchan indicate, string name){\r\n      int count = 0; \r\n      while (true) {\r\n         select{\r\n            case <? want:{\r\n               count++;\r\n               println(\"Einer mehr wartet auf \" + name + \".\");\r\n            }\r\n            case <? indicate: {\r\n               if (count != 0){\r\n                  count--; \r\n                  chill <! false; \r\n                  println(\"Einer weniger wartet auf \" + name +\".\");\r\n               }  \r\n            }\r\n         }\r\n      } \r\n   }\r\n\r\n   void initialize(){\r\n      start cell(read[0],write[0],0,0); \r\n      start cell(read[1],write[1],0,1);\r\n      start cell(read[2],write[2],0,2);\r\n \r\n      start chillDaemon(wantDatumDa,chillDatumDa,_signalDatumDa,\"Datum\");\r\n      start chillDaemon(wantPlatzFrei,chillPlatzFrei,_signalPlatzFrei,\"Platz\");\r\n   }\r\n\r\n   void mpLock(boolchan1 g){\r\n      g <! true;\r\n   } \r\n   void mpUnlock(boolchan1 g){\r\n      <? g;\r\n   }\r\n\r\n   int used = 0; \r\n   boolchan1 guard; \r\n\r\n   void put(int x){\r\n      mpLock(guard);\r\n      while (!(used < 3)){\r\n         wantPlatzFrei <! true;\r\n         mpUnlock(guard);\r\n         <? chillPlatzFrei; \r\n         mpLock(guard);  \r\n      } \r\n      write[used] <! x;\r\n      used++;   \r\n      _signalDatumDa <! true;\r\n      mpUnlock(guard);\r\n   }\r\n\r\n   int get(){\r\n      mpLock(guard);\r\n      while (!(used > 0)){\r\n         wantDatumDa <! true;\r\n         mpUnlock(guard);\r\n         <? chillDatumDa; \r\n         mpLock(guard);  \r\n      } \r\n      int temp = <? read[0];\r\n      used--;\r\n      for (int j=1 ; j <= used ; j++){\r\n         write[j-1] <! (<? read[j]);\r\n      }\r\n      _signalPlatzFrei <! true;\r\n      mpUnlock(guard);\r\n      return temp;\r\n   }\r\n}\r\n\r\nKanal3 k;\r\n\r\nvoid produce(int id){ \r\n   while (true) {\r\n       println(\"Erzeuger \" + id + \" hat \" + id + \" produziert.\");\r\n       k.put(id);\r\n   }\r\n}\r\n  \r\nvoid consume(string name){ \r\n   while (true) {\r\n       int c = k.get();\r\n       println(\" Verbraucher \" + name + \" hat \" + c + \" konsumiert.\");\r\n   }\r\n}\r\n\r\nmainAgent{\r\n   k.initialize();\r\n\r\n   start produce(1); // Ein Erzeuger. \r\n   start produce(2); // Zwei Erzeuger. \r\n   start produce(3); // Drei Erzeuger. \r\n   start produce(4); // Vier Erzeuger. \r\n   start produce(5); // Fuenf Erzeuger. \r\n   \r\n   start consume(\"A\"); // Ein Verbraucher. \r\n   start consume(\"B\"); // Zwei Verbraucher. \r\n   start consume(\"C\"); // Drei Verbraucher. \r\n   start consume(\"D\"); // Vier Verbraucher. \r\n}\r\n\r\n"},"producer-consumer-MP-encoded-in-SM":{"code":"monitor Kanal3{\r\n\r\n   int[3] n;\r\n   int used = 0; \r\n\r\n   condition platzIstFrei with (used < 3);\r\n   condition datumIstDa with (used > 0);\r\n\r\n   void put (int x){\r\n      waitForCondition platzIstFrei;\r\n      n[used] = x;\r\n      used++;\r\n      signal datumIstDa;\r\n   }\r\n\r\n   int get(){\r\n      waitForCondition datumIstDa;\r\n      int temp = n[0];\r\n      used--;\r\n      for (int j=1; j <= used;j++){\r\n         n[j-1]=n[j];\r\n      }\r\n      signal platzIstFrei;\r\n      return temp;\r\n   }\r\n}\r\n\r\nKanal3 k;\r\n\r\nvoid produce(int id){ \r\n   while (true) {\r\n       k.put(id);\r\n       println(\"Erzeuger \" + id + \" hat \" + id + \" produziert.\");\r\n   }\r\n}\r\n  \r\nvoid consume(string name){ \r\n   while (true) {\r\n       int c = k.get();\r\n       println(\" Verbraucher \" + name + \" hat \" + c + \" konsumiert.\");\r\n   }\r\n}\r\n\r\nmainAgent{\r\n   start produce(1); // Ein Erzeuger. \r\n   start produce(2); // Zwei Erzeuger. \r\n   start produce(3); // Drei Erzeuger. \r\n   start produce(4); // Vier Erzeuger. \r\n   start produce(5); // Fuenf Erzeuger. \r\n   \r\n   start consume(\"A\"); // Ein Verbraucher. \r\n   start consume(\"B\"); // Zwei Verbraucher. \r\n   start consume(\"C\"); // Drei Verbraucher. \r\n   start consume(\"D\"); // Vier Verbraucher. \r\n}\r\n\r\n"},"producer-consumer-MP":{"code":"intchan3 k;\r\n\r\nvoid produce(int id){ \r\n   while (true) {\r\n       println(\"Erzeuger \" + id + \" hat \" + id + \" produziert.\");\r\n       k <! id;\r\n   }\r\n}\r\n  \r\nvoid consume(string name){ \r\n   while (true) {\r\n       int c = <? k;\r\n       println(\" Verbraucher \" + name + \" hat \" + c + \" konsumiert.\");\r\n   }\r\n}\r\n\r\nmainAgent{\r\n   start produce(1); // Ein Erzeuger. \r\n   start produce(2); // Zwei Erzeuger. \r\n   start produce(3); // Drei Erzeuger. \r\n   start produce(4); // Vier Erzeuger. \r\n   start produce(5); // Fuenf Erzeuger. \r\n   \r\n   start consume(\"A\"); // Ein Verbraucher. \r\n   start consume(\"B\"); // Zwei Verbraucher. \r\n   start consume(\"C\"); // Drei Verbraucher. \r\n   start consume(\"D\"); // Vier Verbraucher. \r\n}\r\n\r\n"},"pseucoStruct":{"code":"struct GanzeZahl { \n\nint n;  \n\nvoid set(int x){\n   n = x;\n}\n\nint get(){\n   return n; \n}\n\nvoid decrement (){\nn = n - 1;\n}\n\n\n}\n\nmainAgent {}"},"second":{"code":"\r\n\r\nvoid countDutch(){ \r\n   println(\" Een\"); \r\n   println(\" Twee\"); \r\n   println(\" Drie\"); \r\n}\r\n\r\nvoid countFrench(){ \r\n   println(\"Un\"); \r\n   println(\"Deux\"); \r\n   println(\"Trois\"); \r\n}\r\n\r\nmainAgent{\r\n      \r\n   agent a1 = start countDutch();        // Ich lass einen Agenten los!\r\n   agent a2 = start countFrench();       // Und noch einen!\r\n\r\n   println(\"  Beide zaehlen!\");       // Das sollen alle wissen. \r\n}\r\n"},"seventh":{"code":"intchan10[5] conn;\r\n\r\nvoid prime(int v, intchan in, intchan out){ \r\n   int p;\r\n   while (true) {\r\n       p = <? in;\r\n       if (p % v != 0 || p == v) {out <! p;} \r\n   }\r\n}\r\n\r\nmainAgent{\r\n   start prime(7, conn[0], conn[1]); // Prueft Teilbarkeit durch 7.\r\n   start prime(5, conn[1], conn[2]); // Prueft Teilbarkeit durch 5.\r\n   start prime(3, conn[2], conn[3]); // Prueft Teilbarkeit durch 3.\r\n   start prime(2, conn[3], conn[4]); // Prueft Teilbarkeit durch 2.\r\n\r\n   for (int j=2; j<=100 ; j++){\r\n       conn[0] <! j; \r\n   } \r\n\r\n   while (true) { // Alles, was aus conn[4] raus kommt, ist prim.\r\n        println( (<? conn[4]) + \" ist eine Primzahl.\"); \r\n   }\r\n}\r\n\r\n"},"sixth":{"code":"intchan[8] result;\r\n \r\nvoid factorial(int z, intchan res){ \r\n   int j, n; \r\n   n=1;\r\n   for (j = z; j > 0 ; j--){\r\n      n = n*j;\r\n   }     \r\n   res <! n; // Ich terminiere, nachdem ich zurueck sende, was rauskommt.\r\n}\r\n\r\nmainAgent{\r\n   int j;\r\n   for (j=0; j<8 ; j++){\r\n       start factorial(j+1,result[j]);  // Ich lasse ein paar (namenlose) Agenten loslegen.\r\n   } \r\n   // \r\n   // Vielleicht hier noch eben eine nagelneue Primzahl berechnen.\r\n   // Oder sonst irgendetwas erledigen.\r\n   //\r\n   for (j=0; j<8 ; j++){       // Hier frage ich die hoffentlich fertigen Ergebnisse ab. \r\n       println(\"Die Fakultaet von \" + (j+1) + \" ist \" + (<? result[j]) + \".\"); \r\n   }  \r\n}\r\n\r\n"},"structAtomareGanzeZahl":{"code":"struct AtomareGanzeZahl { \n\nmutex guard; // nicht direkt zugreifbar\n\nint n;  // nicht direkt zugreifbar, dies ist das gemeinsame Datum  \n\nvoid set(int x){\n   lock guard;\n   n = x;\n   unlock guard;\n}\n\nint get(){\n   lock guard;\n   int temp = n; // nur lokal sichtbar\n   unlock guard;\n   return temp; \n}\n\n\n}\n\nmainAgent {}"},"tenth-executable":{"code":"int nextPseudoRand (int y) {\r\n   y = (y+1) * 11173 %  11939;\r\n   return (y>0?y:-y);\r\n}\r\n\r\nvoid remember(int x){\r\n}\r\n\r\nbool alreadySeen(int x){\r\nreturn false;\r\n}\r\n\r\nint[10] post(int x){\r\n   int[10] res;\r\n   for (int j = 0 ; j <10; j++){\r\n      x = nextPseudoRand(x); \r\n      res[j] = x % 10000 ;\r\n   }\r\n   return res;\r\n}\r\n\r\nintchan10 w;\r\n\r\nmainAgent{\r\n   int curr;\r\n   int[10] nxt;\r\n   bool found = false;\r\n  int i =0;\r\n \r\n   w <! 0;                    // Hier der initiale Knoten, den puffere ich in meinem Kanal.\r\n   \r\n   while (!(found)){ \r\n      curr = <? w;              // Noch ein Knoten zu bearbeiten.\r\n      found = (curr == 13); // Vielleicht ists ja der gesuchte Knoten.\r\n      i++;\r\n      println( i + \". Ich bearbeite Knoten \" + curr);\r\n      if (!alreadySeen(curr)){  // Kenn ich noch nicht.\r\n         remember(curr);      // Der soll mich kennenlernen.\r\n         nxt = post(curr);    // Und der hat Nachfolger.\r\n         for (int j=0 ; j < 10; j++){\r\n            w <! nxt[j];       // Die Nachfolger puffere ich in meinem Kanal.\r\n         }\r\n      }\r\n   } \r\n   println(\"Ja, der 13 Knoten ist erreichbar.\");\r\n}"},"third":{"code":"\nvoid countDutch(){ \n   println(\" Een\"); \n   println(\" Twee\"); \n   println(\" Drie\"); \n}\n\nvoid countFrench(){ \n   println(\"Un\"); \n   println(\"Deux\"); \n   println(\"Trois\"); \n}\n\nmainAgent{\n      agent a2 = start countFrench();\n\t  agent a1 = start countDutch();\n\t  \n   //a1 = countDutch();        // Ich erzeuge einen Agenten.\n   //a2 = countFrench();       // Und noch einen.\n\n   //start a2;                 // Jetzt darf einer loszaehlen.\n   //start a1;                 // Und der andere auch.\n\n   join a2;                  // Ich warte, bis der Franzose fertig ist.\n   join a1;                  // Ist der Niederlaender auch fertig?\n\n   println(\"Beide sind fertig!\"); // Das sollen alle wissen. \n}\n"},"third3":{"code":"int fin;\r\nintchan3 cc;\r\n \r\nvoid factorial(intchan c){ \r\n   int n=1;         \r\n   int z = <? c; // Womit soll ich rechnen?\r\n   for (int j=1; j<=z ; j++){\r\n      n= n*j; \r\n   }      // Hier ist die Arbeit erledigt.\r\n   c <! n; // Ich sende, was rauskommt.\r\n}\r\n\r\nmainAgent{\r\n   agent a1 = start factorial(cc);             // Ich lasse einen Agenten loslegen.\r\n   agent a2 = start factorial(cc);             // Und noch einen.\r\n   cc <! 3;   \r\n   fin = <? cc;                           // Mal sehen was der draus macht.\r\n   println(\"Die Fakultaet von der Fakultaet von 3 ist \" + fin + \".\"); \r\n}\r\n\r\n"}}; 


(function() {
  var PC, PCC, timelogs;

  PC = require("PseuCo");

  PCC = require("CCSCompiler");

  timelogs = {};

  describe("PseuCo parser", function() {
    var i, printTimeLogs, programs, testProgram;
    programs = testCases;
    testProgram = function(i) {
      it("should parse and compile \"" + i + "\"", function() {
        var e, e2, tree;
        tree = null;
        try {
          tree = PC.parser.parse(programs[i].code);
        } catch (_error) {
          e = _error;
          e2 = new Error("Line " + e.line + ", column " + e.column + ": " + e.message);
          e2.name = e.name;
          throw e2;
        }
        expect(tree instanceof PC.Node).toBe(true);
        return programs[i].tree = tree;
      });
      it("should check types for \"" + i + "\"", function() {
        var e, e2;
        try {
          return programs[i].tree.getType();
        } catch (_error) {
          e = _error;
          e2 = new Error("Line " + e.line + ", column " + e.column + ": " + e.message);
          e2.name = e.name;
          throw e2;
        }
      });
      it("should compile \"" + i + "\" to CCS", function() {
        var compiler;
        compiler = new PCC.Compiler(programs[i].tree);
        return programs[i].ccs = compiler.compileProgram();
      });
      return it("should be able to generate traces for " + i, function() {
        var start;
        start = new Date();
        programs[i].ccs.getTraces(false, 20);
        return timelogs[i] = (new Date()).getTime() - start.getTime();
      });
    };
    printTimeLogs = function() {
      var p, t, _results;
      console.log("\nTrace execution times:");
      _results = [];
      for (p in timelogs) {
        t = timelogs[p];
        _results.push(console.log("" + p + ": " + t + "ms"));
      }
      return _results;
    };
    for (i in programs) {
      testProgram(i);
    }
    it("should print time logs", function() {
      return printTimeLogs();
    });
    return null;
  });

}).call(this);

