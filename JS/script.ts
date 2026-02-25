let zeroButton = document.querySelector(".zero") as HTMLButtonElement
let oneButton = document.querySelector(".one") as HTMLButtonElement
let twoButton = document.querySelector(".two") as HTMLButtonElement
let threeButton = document.querySelector(".three") as HTMLButtonElement
let fourButton = document.querySelector(".four") as HTMLButtonElement
let fiveButton = document.querySelector(".five") as HTMLButtonElement
let sixButton = document.querySelector(".six") as HTMLButtonElement
let sevenButton = document.querySelector(".seven") as HTMLButtonElement
let eightButon = document.querySelector(".eight") as HTMLButtonElement
let nineButton = document.querySelector(".nine") as HTMLButtonElement

let allClearButton = document.querySelector(".reset") as HTMLButtonElement
let deleteButton = document.querySelector(".delete") as HTMLButtonElement
let divideButton = document.querySelector(".divide") as HTMLButtonElement
let multiplyButton = document.querySelector(".multiply") as HTMLButtonElement
let subButton = document.querySelector(".sub") as HTMLButtonElement
let addButton = document.querySelector(".add") as HTMLButtonElement
let dotButton = document.querySelector(".dot") as HTMLButtonElement
let equalButton = document.querySelector(".equal") as HTMLButtonElement
let percentButton = document.querySelector(".percent") as HTMLButtonElement

let resultTextContainer = document.querySelector(".large-text")! as HTMLParagraphElement
let calculTextContainer = document.querySelector(".small-text")! as HTMLParagraphElement


// ---------------------- La zone des fonctions ------------------------

function buttonFunction(button: HTMLButtonElement, symbol: string): void {
    button?.addEventListener("click", () => {
        // Si la zone de texte est vide on affiche le symbole selectionné
        if (resultTextContainer.innerText === "") {
            resultTextContainer.innerText = symbol
        } else {
            resultTextContainer.innerText += symbol // Sinon on ajoute le symbole selectionné à la suite du dernier symbole
        }
    })
}




function resetOrDeleteButton(button: HTMLButtonElement, action: 'reset' | 'delete'): void | number {
    button?.addEventListener("click", () => {

        // Si action est reset, on vide les zones de textes

        if (action === 'reset') {
            resultTextContainer.textContent = ""
            calculTextContainer.textContent = ""
            // Si action est delete, le dernier symmbole est supprimé

        } else if (action === 'delete') {
            resultTextContainer.textContent = resultTextContainer.textContent.slice(0, -1)
        }
    });
}




function operatorButton(button: HTMLButtonElement, symbol: string): void | number {
    button?.addEventListener("click", () => {

        const lastElement = resultTextContainer.textContent.slice(-1) // Récupère la valeur du dernier symbole


        // Si le conteneur du texte est vide ou si le dernier élément est un opérateur on n'ajoute rien et affiche dans la console

        if (resultTextContainer.textContent === "" || ["+", "-", "/", "*", "%",].includes(lastElement)) {
            document.querySelector(".calculator")?.classList.add("shake")
            setTimeout(() => document.querySelector(".calculator")?.classList.remove("shake"), 300)
            return
        }

        // Sinon 
        else {
            resultTextContainer.innerText += symbol
        }
    });
}



// bouton pour les chiffres avec des addEventListener 

buttonFunction(zeroButton, "0")
buttonFunction(oneButton, "1")
buttonFunction(twoButton, "2")
buttonFunction(threeButton, "3")
buttonFunction(fourButton, "4")
buttonFunction(fiveButton, "5")
buttonFunction(sixButton, "6")
buttonFunction(sevenButton, "7")
buttonFunction(eightButon, "8")
buttonFunction(nineButton, "9")

// bouton pour les boutons de suppression avec addEventListener

resetOrDeleteButton(allClearButton, 'reset')
resetOrDeleteButton(deleteButton, 'delete')


// Boutons pour les opérateurs avec addEventListener

operatorButton(addButton, "+")
operatorButton(subButton, "-")
operatorButton(multiplyButton, "*")
operatorButton(divideButton, "/")
operatorButton(percentButton, "%")
operatorButton(dotButton, ".")




// Fonctions pour trier les nombres et les opérateurs
function arrayParsing(expression: string, numbersArray: number[], operatorsSymbol: string[]): void {

    let actualNumber: string | number = ""

    // boucle qui prends "expression" et voit, carcatère par caractère par caractère s'ils sont nombres ou opérateurs
    for (let char of expression) {

        // Si le caractère est un pourcentage, calcul du pourcentage sur actualNumber, ajout du résultat au tableau de nombre et puis reset de actualNumber
        if (char === "%") {
            actualNumber = Number(actualNumber) / 100
            numbersArray.push(actualNumber)
            actualNumber = ""
        }// Sinon, si le caractère est opérateur, on ajoute actualNUmber au tableau de nombre et l'opérateur au tableau d'opérateur puis on reset actualNumber
        else if (["+", "-", "/", "*"].includes(char)) {

            numbersArray.push(Number(actualNumber))
            operatorsSymbol.push(char)
            actualNumber = ""
        }// SInon, le caractère est un nombre et on l'ajoute a actualNumber
        else {
            actualNumber += char
        }
    }

    numbersArray.push(Number(actualNumber))
}




// fonction pour faire les calculs prioritaires : multiplication, division et pourcentage

function priorityOperation(operatorsSymbol: string[], numbersArray: number[]) {

    // La boucle for tourne sur le tableau de sombole opératoire car 1 élément de moins que le tableau de nombre
    for (let i: number = operatorsSymbol.length - 1; i >= 0; i--) {
        let result: number = 0

        switch (operatorsSymbol[i]) {
            case "*":
                result = numbersArray[i] * numbersArray[i + 1]
                numbersArray.splice(i, 2, result)
                operatorsSymbol.splice(i, 1)
                break;

            case "/":
                // Cas de la division par zéro, retourne false
                if (numbersArray[i + 1] == 0) {
                    return false
                }
                // Sinon on exécute le calcul classique de la division
                result = numbersArray[i] / numbersArray[i + 1]
                numbersArray.splice(i, 2, result)
                operatorsSymbol.splice(i, 1)
                break;
        }
    }
    return true
}





function addAndSub(operatorsSymbol: string[], numbersArray: number[]): number {
    let total: number = numbersArray[0]

    for (let i: number = 0; i < operatorsSymbol.length; i++) {
        switch (operatorsSymbol[i]) {
            case "+":
                total += numbersArray[i + 1]
                break;

            case "-":
                total -= numbersArray[i + 1]
                break;
        }
    }
    return total
}



equalButton?.addEventListener("click", () => {
    let expression: string = resultTextContainer.textContent
    let numbersArray: number[] = []
    let operatorsSymbol: string[] = []

    calculTextContainer.textContent = resultTextContainer.textContent

    arrayParsing(expression, numbersArray, operatorsSymbol)

    let checkValidation: boolean = priorityOperation(operatorsSymbol, numbersArray)

    // Si le retour de priorityOperation est false (cas de la division par zéro) l'écran affiche ERROR
    if (checkValidation === false) {
        resultTextContainer.textContent = "ERROR"
        calculTextContainer.textContent = ""
    }// Sinon, on continue avec l'addition et soustraction et on affiche le résultat
    else {
        let total = addAndSub(operatorsSymbol, numbersArray)
        resultTextContainer.textContent = `${total}`
    }
})


