//Dropdown menus
var dropdowns = [
    {id: 'month', forEndNum: 13, text:['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']},
    {id: 'day', forEndNum: 32},
    {id: 'year', forEndNum: 5, text:[, 2020, 2021, 2022, 2023]}
]

for(let a = 0; a < dropdowns.length; a++) {
    var selectEl = document.createElement('select')
    selectEl.setAttribute('id', dropdowns[a].id)
    document.querySelector('#dropdowns').appendChild(selectEl)
    var options = []
    var text = []
    for (let b = 1; b < dropdowns[a].forEndNum; b++) {
        options[b] = document.createElement('option')
        options[b].setAttribute('value', b) //The values always start at 1
        if (dropdowns[a].text == undefined) { //If the text doesn't need to be different than the value
            text[b] = document.createTextNode(b)
        } else { //Otherwise find specificed text
            text[b] = document.createTextNode(dropdowns[a].text[b])
        }
        options[b].appendChild(text[b])
        document.getElementById(dropdowns[a].id).appendChild(options[b])
    }
}

//Function
function generateMap() {
    //Get input date
    var monthIn = document.querySelector('#month').value
    var dayIn = document.querySelector('#day').value
    var yearIn = document.querySelector('#year').value - 1

    //Convert input to single day value
    var dayCount = [0, 0, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
    var day = (Number(dayCount[monthIn]) + Number(dayIn)) - 96 + (365 * yearIn)
    
    /* Info */
    
    //Clear any previous text
    document.querySelector('#dateoverlay').innerHTML = ''
    document.querySelector('#totaloverlay').innerHTML = ''
    document.querySelector('#activeoverlay').innerHTML = ''

    //Date
    var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var diq = months[monthIn] + ' ' + dayIn + ', ' + (yearIn + 2020) //diq = day in question :D
    var dateh1 = document.createElement('h1')
    dateh1.innerHTML += diq
    document.querySelector('#dateoverlay').appendChild(dateh1)

    //Total cases
    if(document.querySelector('#total').checked) {
        let total = 0
        for(let a = 0; a < counties.length; a++) {
            total += Number(window.csv.split('\n')[a + 2688].split(',')[day])
        }
        var totalh2 = document.createElement('h2')
        totalh2.innerHTML += 'Total number <br> of cases: ' + total
        document.querySelector('#totaloverlay').appendChild(totalh2)
    }

    //Number of counties each
    if(document.querySelector('#casenumber').checked) {
        let lesscases = 0
        let morecases = 0
        for(var a = 0; a < counties.length; a++) {
            var cases = window.csv.split('\n')[a + 2688].split(',')[day]
            if(cases <= 20) {
                lesscases++
            } else {
                morecases++
            }
        }
        var morecasesh2 = document.createElement('h2')
        morecasesh2.innerHTML += 'Total number of counties with more <br> than 20 active cases: ' + morecases
        document.querySelector('#activeoverlay').appendChild(morecasesh2)
        var lesscasesh2 = document.createElement('h2')
        lesscasesh2.innerHTML += 'Total number of counties with less than <br> or equal to 20 active cases: ' + lesscases
        document.querySelector('#activeoverlay').appendChild(lesscasesh2)
    }

    /* Map */

    //Canvas
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')

    //Put the image over it
    var link = 'https://upload.wikimedia.org/wikipedia/commons/3/31/Texas_Locator_Map.PNG'
    var img = document.createElement('img')
    img.setAttribute('src', link)
    img.crossOrigin = "Anonymous"
    img.onload = function() {
        canvas.setAttribute('width', img.width)
        canvas.setAttribute('height', img.height)
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const color = {r: 0, g: 255, b: 0, a: 255}

        //Flood fill counties accordingly
        for(let a = 0; a < counties.length; a++) {
            var cases = window.csv.split('\n')[a + 2688].split(',')[day]
            if(cases <= 20) {
                floodFill(imageData, color, counties[a][0], counties[a][1])
            }
        } 

        ctx.putImageData(imageData, 0, 0)
        canvas.style.display = 'block'
    }
}

//Event Listenter
document.querySelector('#generate').addEventListener('click', generateMap)