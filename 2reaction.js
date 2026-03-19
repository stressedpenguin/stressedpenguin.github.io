let testStarted = false
let startTime = null
let finishTime = null
let timer = null
let trialCount = 0
let maxTrials = 9
let results = []
let testFinished = false
let reactionTimes = []

const clickarea = document.querySelector('.clickarea')
const message = document.querySelector('.message')
const note = document.querySelector('.note')

const randomNumber = (min, max, int = false) => {
	return (int)
		? Math.floor(Math.random() * (max - min + 1)) + min
		: Math.random() * (max - min) + min
}

const updateText = (messageText, noteText) => {
	message.textContent = messageText
	note.textContent = noteText
}

function calculateAverageRT(){

    // trials 2–9
    let analyzed = results.slice(1,9)

    // remove distraction responses
    let filtered = analyzed.filter(rt => rt <= 1000)

    let sum = filtered.reduce((a,b)=>a+b,0)

    let avg = filtered.length ? sum / filtered.length : 0

    return avg
}

const handleClick = event => {
	event.preventDefault()
	event.stopPropagation()
	if(testFinished) return
	
	if (!testStarted) {
		const msUntilGreen = randomNumber(3, 8)
		startTime = new Date()
		finishTime = new Date(startTime.getTime() + (msUntilGreen * 1000))

		clickarea.classList.add('red')
		updateText('Wait for green...', '')
		testStarted = true

		timer = setTimeout(() => {
			clickarea.classList.remove('red')
			clickarea.classList.add('green')
			message.textContent = 'Spacebar!'
		}, msUntilGreen * 1000)
	} else {
		testStarted = false

		if (new Date() < finishTime) {
			clearTimeout(timer)
			clickarea.classList.remove('red')
			updateText('Too soon!', 'Click to try again')
			
		} else {
			clickarea.classList.remove('green')
			let reaction = new Date() - finishTime
            results.push(reaction)
            trialCount++

                if(trialCount >= maxTrials){
				testFinished = true
	            clickarea.classList.remove('green')
	            updateText("scroll down PLEase")
	            sessionStorage.setItem("reactionResults", JSON.stringify(results))
				let nextButton = document.createElement("button")
	            nextButton.textContent = "Next Test"
	            nextButton.style.fontSize = "40px"
				nextButton.style.padding = "20px 40px"
				nextButton.style.marginTop = "30px"
				nextButton.style.cursor = "pointer"

	            nextButton.onclick = function(){
		        window.location.href = "3STROOP.html"
	}

	            document.body.appendChild(nextButton)
           
            }

                else{
                clickarea.classList.remove('green')
                updateText("keep going!!1!!1!", `Trial ${trialCount} / ${maxTrials}`)
            }
		}
	}
}

document.addEventListener('keydown', function(e){
	if(e.code === "Space"){
		handleClick(e)
	}
})

clickarea.addEventListener('touchstart', handleClick)
