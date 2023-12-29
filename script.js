document.addEventListener("DOMContentLoaded", ()=>{
    let exprDebug = "";
    let exprVar_Val ="";
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
	// list de <tr>:
    let listTr = [];
	// Pour supprimer :
    let undo = [{"exp":"","etat":true,"non":0,"couche":0}];
	// Pour avoir les variables crées:
    let nomsVar = ["A","B","C","D","E","F","G","H"];
    let valsVars = {"A":0,"B":0,"C":0,"D":0,"E":0,"F":0,"G":0,"H":0};
    let listVar = [];
    let valVar = [];
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
    const OPERA = "+×⊕n";
    const ALPHA = "ABCDEFGH";

	// I) GRANDE PARTIE DES BOUTONS ET INTERFACES :
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
    nouveauVar.addEventListener("click", ajoutVar);

    // II) GRANDE PARTIE DES FONCTIONS MAJ ET UTILITAIRES :
    function dec_bin(dec) {
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
        init_Calcs(exprDebug);
		// MAJ la vraie table de vérité selon tablVerite
        updateTable();
    }
    
    function updateNouVar() {
		// NouVar quand alg.innerHTML change est perdu, il faut le maj :
        nouveauVar = document.getElementById("new-var");
        nouveauVar.addEventListener("click", ajoutVar);
    }
    
    function addMettreBool() {
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
            addMettreBool();
			// MAJ NouVar
            updateNouVar();
			
            updateExpression();
			// Enlève le mot utilisé pour la nouvelle variable dans nomsVar
            nomsVar.splice(0, 1);
        }
    }
    function echange(i, remplacant, text) {
        return text.substring(0, i) + remplacant + text.substring(i + remplacant.length);
    }
    // III) CALCULER L'EXPRESSION:
    function var_val(expr){
        let lettre = "nugget";
        for (let i = 0; i<expr.length;i++){
            lettre = expr[i];
            
            if (ALPHA.includes(lettre)){
                expr = echange(i,valsVars[lettre].toString(),expr);
            }
        }
        return expr;
    }
    function calcExpr(depart, cut = false, fin=-1){
        console.log("f")
        // Calcule d'une expression => Récursivité
        let encours = true;
        let not_start = -1;
        let val1;
        let val2;
        let typeOpe;
        let pointeur = depart;
        let S = false;
        let lettre = "nugget";
        console.log(exprVar_Val + " => " + exprVar_Val.substring(depart));
        while (encours){
            typeOpe=-1;
            val1=2;
            val2=2;
            chercher = true;
            not_start = -1;
		    while (chercher){
                if (pointeur >= exprVar_Val.length || (cut && pointeur >= fin)){
                    pointeur+=1;
                    chercher = false;
                    encours = false;
                }else {
                    lettre = exprVar_Val[pointeur];
                    
                    pointeur+=1;
                    // On ne regarde pas les < et les >
                    if ("<>".includes(lettre) == false || lettre==undefined){
                        if (lettre=="0" || lettre=="1"){
                            if (not_start == -1){
                                if (val1==2){
                                    val1 = lettre;
                                } else {
                                    val2 = lettre;
                                }
                            }
                        } else if (OPERA.includes(lettre)){
                            if (typeOpe==-1){
                                typeOpe=OPERA.indexOf(lettre);
                                if (typeOpe == 3){
                                    not_start=depart+3;
                                }
                            } else{
                                if (lettre =="n" ){
                                    not_start = pointeur+1;
                                } else {
                                    chercher=false;
                                }
                            }
                        }   
                        
                        if (lettre == "/") {
                            if (not_start!=-1 || typeOpe==3){
                                if (calcExpr(not_start,cut=true,fin=pointeur) ==1){
                                    outil = "0";
                                } else {
                                    outil = "1";
                                }
                                console.log("a")
                                if (val1==2){
                                    val1 = outil;
                                    typeOpe = -1;
                                } else {
                                    val2 = outil;
                                    chercher=false;
                                }
                            } else {
                                
                                chercher = false;
                                // Pour enlever n> après "/"
                                pointeur +=2;
                            }
                        }
                    }
                }
            }
            switch (typeOpe){
                case 0:
                    S = (val1=="1")||(val2=="1");
                    break;
                case 1:
                    S = (val1=="1")&&(val2=="1");
                 break;
                case 2:
                    S = (val1=="0")&&(val2=="1") ||(val1=="1")&&(val2=="0");
                    break;
                case 3:
                    S = (val1=="0");
                    break;
                default:
                    S = (val1=="1");
            }
            if (cut){
                outil = depart-3;
            } else {
                outil =depart;
            }
            
            if (S&&!cut || !S&&cut){
                exprVar_Val = exprVar_Val.substring(0,outil)+"1"+exprVar_Val.substring(pointeur-1);
            } else {
                exprVar_Val = exprVar_Val.substring(0,outil)+"0"+exprVar_Val.substring(pointeur-1);
            }
            pointeur = depart;
            console.log(exprVar_Val);
        }
        if (S) {
            return 1;
        } else {
            return 0;
        }
    }

    function init_Calcs(){
		// Crée le tableau de vérité associé sur tablVerite

        valVar = 0;
        bibVar = {};
        tablVerite = [];
        let S = 0;
        for (let y = 0; y<2**listVar.length;y++){
            tablVerite.push([]);
            for (let x = 0; x<listVar.length+1;x++){
                tablVerite[y].push("?");
            }
        }
        // Crée le tableau de vérité associé sur tablVerite
        for (let i = 0; i<2**listVar.length;i++){
            valVar = dec_bin(i);
            // Utilisation de liste valsVars
            for (let o = 0; o<listVar.length; o++){
                if (valVar.length-o >= +1){
                    tablVerite[i][o]=parseInt(valVar[valVar.length-o-1]);
                } else {
                    tablVerite[i][o]=0;
                } 
                valsVars[ALPHA[o]] = tablVerite[i][o];
            }
            exprVar_Val = var_val(exprDebug);
            console.log("CALCULE POUR "+exprVar_Val+" :")
            tablVerite[i][listVar.length]= calcExpr(0);
        }
    }

});
