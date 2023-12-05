document.addEventListener("DOMContentLoaded", ()=>{
    let exprDebug = "";
    let expression = "";
    // Definition/Acquerir bouton de HTML :
    let ou = document.getElementById("ou");
    let et = document.getElementById("et");
    let xor = document.getElementById("xor");
    let startNot = document.getElementById("start-not");
    let stopNot = document.getElementById("stop-not");
    let suppr = document.getElementById("suppr");
    let roueVar = document.querySelector("roul");
    let nouveauVar = document.getElementById("new-var");
	
	// Definition des éléments du tableau:
    let paren = document.getElementById("paren");
    let these = document.getElementById("these");
    let tbody = document.querySelector(".verite tbody");
    let thead = document.querySelector(".verite thead");
	// list de <tr> :
    let listTr = [];
	// Pour supprimer :
    let undo = [{"exp":"","etat":true,"non":0,"couche":0}];
	// Pour avoir les variables crées:
    let nomsVar = ["A","B","C","D","E","F","G","H"];
    let listVar = [];
    let valsVar = [];
	// Règle de syntaxe:
    let nonIrresolu = 0;
    let couche = 0;
    let coucheDebug = 0;
	// etatEcriture => true: on peut mettre une variable et non...
	//				   false: on peut mettre des opérations et ...non
    let etatEcriture = true;
	// variables d'outils :
    let compteur = 0
    let tablVerite = [];
    let outil = 0;
    let x = 0;
    let index = 0
    let copie = 0;
	// Constante utile:
    const OPERA = "×+⊕";
    const ALPHA = "ABCDEFGH";
	
    function calcExpr(Expr){
		// :O
    }

    function calc(){
		// Crée le tableau de vérité associé sur tablVerite
        outil = " ";
        valsVar = [];
        bibVar = {};
        tablVerite = [];
        for (let y = 0; y<2**listVar.length;y++){
            tablVerite.push([])
            for (let x = 0; x<listVar.length+1;x++){
                tablVerite[y].push("?");
            }
        }
        for (let i = 0; i<2**listVar.length;i++){
            valsVar.push(dec2bin(i));
            for (let o = 0; o<listVar.length; o++){
                if (valsVar[i].length-o >= +1){
                    tablVerite[i][o]=parseInt(valsVar[i][valsVar[i].length-o-1]);
                } else {
                    tablVerite[i][o]=0;
                } 
            }
        }
        console.log(tablVerite);

    }
    function dec2bin(dec) {
		// Convertiseur decimal en binaire
        return (dec >>> 0).toString(2);
    }
    function updateTable(){
        // MAJ Table, Réinitialise la dimension de la vraie table
        x = "";
        tbody.innerHTML = "";
        listTr = [];
        for (let varBout of listVar){
            x = x.concat("<th> &nbsp;"+varBout.innerText+"&nbsp; </th>");
            
        }
        for (let i =0; i<2**listVar.length;i++){
            tbody.innerHTML += "<tr></tr>";
        }
        index =0;
        for (let tr of document.querySelectorAll(".verite tbody tr") ){
            listTr += tr
            for (let i =0; i<listVar.length+1;i++){
                tr.innerHTML += "<td>"+ tablVerite[index][i] +"</td>";
            }
            index += 1;
        }
        thead.innerHTML = x+"<th> &nbsp;&nbsp; S &nbsp&nbsp; </th>";
        
        
    }
    function updateExpression() {
        // Met à jour l'expression
        exprDebug = expression;
        // Version Debuggée
        for (let i = 0; i < nonIrresolu ; i++){
            exprDebug+="</n>";
        }

        document.querySelector("alg").innerHTML = "S="+exprDebug;
		// Calcule exprDebug
        calc(exprDebug);
		// MAJ la vraie table de vérité selon tablVerite
        updateTable();
    }
    ou.addEventListener("click", function() {
		// Ce event listener ajoute + soit "ou"
        if (!etatEcriture){
            // Etat écriture true si il y a une variable ou que c'est le début d'une barre.
            expression += "+";
            etatEcriture = true;
            undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
        }
        updateExpression();
    });

    et.addEventListener("click", function() {
		// Ce event listener ajoute * soit "et"
        if (!etatEcriture){
            expression += "×";
            etatEcriture = true;
            undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
        }
        
        updateExpression();
    });

    xor.addEventListener("click", function() {
		// Ce event listener ajoute "xor"
        if (!etatEcriture){
            expression += "⊕";
            etatEcriture = true;
            undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
        }
        
        updateExpression();
    });

    startNot.addEventListener("click", function() {
		// Ce event listener ajoute <n>
        if (etatEcriture){
            expression += "<n>";
            couche+=1;
            nonIrresolu += 1;
            undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
        }
        updateExpression();
    });

    stopNot.addEventListener("click", function() {
		// Ce event listener ajoute </n>
        if (!etatEcriture && nonIrresolu>0){
            expression +=  "</n>";
            nonIrresolu -= 1;
            undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
        }
        updateExpression();
    });

    suppr.addEventListener("click", function() {
        // UNDO
        if (undo.length > 1){
            etat = undo[undo.length-2]
            expression = etat["exp"];
            etatEcriture = etat["etat"];
            couche = etat["couche"];
            nonIrresolu = etat["non"];
            undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
            undo.pop()
            undo.pop()
        }
        updateExpression();
    });
    function updateNouVar() {
		// NouVar quand alg.innerHTML change est perdu, il faut le maj :
        nouveauVar = document.getElementById("new-var");
        nouveauVar.addEventListener("click", ajoutVar);
    }
    
    function addMetBool() {
		// Cette fonction ajoute un addEventListener "click", metbool 
        for (let varBout of listVar){
			
            varBout.addEventListener("click", (event) => {
                if (etatEcriture){
                metBool(event.target.innerHTML);
                
                }
            });
        }
    }
    
    function metBool(nomVar) {
		// Cette fonction ajoute le nom du Var sélectionné
        expression += String(nomVar);
        etatEcriture = false;
        undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
        updateExpression();
    }
    
    function ajoutVar() {
		// Cette fonction va ajouter un bouton de variable
        if (nomsVar.length != 0) {
			// Bouton inscrit sur innerHTML de la roue de variable
            roueVar.innerHTML = roueVar.innerHTML + "<button id=\"" + nomsVar[0] + "\">" + nomsVar[0] + "</button>";
            // list Var soit la liste des boutons de variables
			listVar = [];
			// Il maj les boutons de variables tous sauf nouvar
            for (let varBout of document.querySelectorAll("roul button")){
                if (varBout.innerHTML != "+ var"){
                    listVar.push(varBout);
                }
            }
			// Ajouter les eventListeners des boutons vars
            addMetBool();
			// MAJ NouVar
            updateNouVar();
			
            updateExpression();
			// Enlève le mot utilisé pour la nouvelle variable dans nomsVar
            nomsVar.splice(0, 1);
        }
    }
    
    nouveauVar.addEventListener("click", ajoutVar);

});
