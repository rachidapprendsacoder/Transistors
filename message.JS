document.addEventListener("DOMContentLoaded", ()=>{
    let exprDebug = "";
    let expression = "";
    // Select the buttons
    let ou = document.getElementById("ou");
    let et = document.getElementById("et");
    let xor = document.getElementById("xor");
    let startNot = document.getElementById("start-not");
    let stopNot = document.getElementById("stop-not");
    let suppr = document.getElementById("suppr");
    let roueVar = document.querySelector("roul");
    let nouveauVar = document.getElementById("new-var");
    let undo = [{"exp":"","etat":true,"non":0,"couche":0}];
    let nomsVar = ["A","B","C","D","E","F","G","H","I","J","K"];
    let listVar = [];
    let nonIrresolu = 0;
    let couche = 0;
    let coucheDebug = 0;
    let etatEcriture = true;
    let compteur = 0
    let lettres = "<<";

    function updateExpression() {
        undo.push({"exp":expression,"etat":etatEcriture,"non":nonIrresolu,"couche":couche});
        exprDebug = "S=" + expression;
        for (let i = 0; i < nonIrresolu ; i++){
            exprDebug+="</n>";
        }
        compteur = 0
        for (let i = 0; i < couche ; i++){
            exprDebug ="<y>" + exprDebug;
            compteur+=1;
            }
        while (compteur+1 < exprDebug.length){
            lettres = exprDebug[compteur] + exprDebug[compteur];
            if (lettres == "<n"){
                exprDebug += exprDebug.slice(0,compteur) + "<y>" + exprDebug.slice(compteur,exprDebug.length)
            }
            else if ( lettres == "</"){
                exprDebug += exprDebug.slice(0,compteur) + "<y>" + exprDebug.slice(compteur,exprDebug.length)
            }
            compteur+=1
            
        }
        console.log(exprDebug);
        document.querySelector("alg").innerHTML = exprDebug;
    }
    // Event listeners for each button
    ou.addEventListener("click", function() {
        if (!etatEcriture){
            expression += "+";
            etatEcriture = true;
        }
        updateExpression();
    });

    et.addEventListener("click", function() {
        if (!etatEcriture){
            expression += "×";
            etatEcriture = true;
        }
        
        updateExpression();
    });

    xor.addEventListener("click", function() {
        if (!etatEcriture){
            expression += "⊕";
            etatEcriture = true;
        }
        
        updateExpression();
    });

    startNot.addEventListener("click", function() {
        if (etatEcriture){
            expression += "<n>";
            couche+=1;
            nonIrresolu += 1;
        }
        updateExpression();
    });

    stopNot.addEventListener("click", function() {
        if (!etatEcriture && nonIrresolu>0){
            expression +=  "</n>";
            nonIrresolu -= 1;
        }
        updateExpression();
    });

    suppr.addEventListener("click", function() {
        // You need to implement your logic for clearing the entire expression
        if (undo.length > 1){
            etat = undo[undo.length-2]
            expression = etat["exp"];
            etatEcriture = etat["etat"];
            couche = etat["couche"];
            nonIrresolu = etat["non"];
            undo.pop()
            undo.pop()
        }
        updateExpression();
    });
    function updateNouVar() {
        nouveauVar = document.getElementById("new-var");
        nouveauVar.addEventListener("click", ajoutVar);
    }
    
    function addMetBool() {
        for (let varBout of listVar){
            varBout.addEventListener("click", (event) => {
                if (etatEcriture){
                metBool(event.target.innerHTML);
                etatEcriture = false;
                }
            });
        }
    }
    
    function metBool(nomVar) {
        expression += String(nomVar);
        updateExpression();
    }
    
    function ajoutVar() {
        if (nomsVar.length != 0) {
            roueVar.innerHTML = roueVar.innerHTML + "<button id=\"" + nomsVar[0] + "\">" + nomsVar[0] + "</button>";
            for (let varBout of document.querySelectorAll("roul button")){
                if (varBout.innerHTML != "+ var"){
                    listVar.push(varBout);
                }
            }

            addMetBool();
            updateNouVar();
            nomsVar.splice(0, 1);
        }
    }
    
    nouveauVar.addEventListener("click", ajoutVar);

});