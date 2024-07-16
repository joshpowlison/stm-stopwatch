const moduleFunctions = {
	"beginStopwatch": beginStopwatch,
	"continueStopwatch": continueStopwatch,
	"showStopwatch": showStopwatch,
	"hideStopwatch": hideStopwatch,
	"adjustStopwatch": adjustStopwatch,
	"stopStopwatch": stopStopwatch,
};

module.addActions(moduleFunctions);

const name = 'Stopwatch';
const timer = document.getElementById('timer');

var timerStartedTimestamp = 0;
var timerEndedTimestamp = 0;
var active = false;

async function beginStopwatch(event)
{
	active = true;
	
	// Set the timer to now
	timerStartedTimestamp = performance.now();
	timerEndedTimestamp = timerStartedTimestamp;
	show();
}

async function continueStopwatch(event)
{
	active = true;
	
	// Have to update the times so that they are based on the present,
	// so that they continue updating properly
	var originalGap = timerEndedTimestamp - timerStartedTimestamp;

	timerEndedTimestamp = performance.now();
	timerStartedTimestamp = timerEndedTimestamp - originalGap;

	updateTimer();
	show();
}

async function showStopwatch(event)
{
	updateTimer();
	show();
}

async function hideStopwatch(event)
{
	timer.classList.remove('show');
}

async function stopStopwatch(event)
{
	active = false;
	
	timerEndedTimestamp = performance.now();
	updateTimer();
}

async function adjustStopwatch(event)
{
	if(isNaN(event))
	{
		module.F('Console.LogError', 'Timer.Adjust can only take a number, in ms. Passed in "' + JSON.stringify(event) + '".');
		return;
	}
	
	// Adding time makes it so that the timer started earlier;
	// removing time makes it so that the timer started later
	timerStartedTimestamp -= Math.round(event);
}

function onAnimationFrame(frameTimestamp)
{		
	if (active)
	{
		timerEndedTimestamp = frameTimestamp;
		updateTimer();
	}
	
	window.requestAnimationFrame(onAnimationFrame);
}

function updateTimer()
{
	var msElapsed = Math.floor(timerEndedTimestamp - timerStartedTimestamp);
	
	var ms = msElapsed % 1000;

	// Minutes don't last 60 seconds- the first lasts 69 seconds, and then wrap back around
	var s = Math.floor(msElapsed / 1000);
	while(s > 69)
		s -= 60;
	
	var m = Math.floor((msElapsed - 10000) / 1000 / 60);
	if(m < 0)
		m = 0;
	
	var text =
		(m + '').padStart(2, '0')
		+ ':' + (s + '').padStart(2, '0')
		+ '.' + (ms + '').padStart(3, '0')
	;
	
	if(m == 69 || s == 69)
		text = 'Nice ' + text;
	
	timer.innerHTML = text;
}

function show()
{
	timer.classList.add('show');
}

window.requestAnimationFrame(onAnimationFrame);