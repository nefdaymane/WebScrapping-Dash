const  sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');


const themeToggler = document.querySelector('.theme-toggler');



menuBtn.addEventListener('click',()=>{
       sideMenu.style.display = "block"
})
closeBtn.addEventListener('click',()=>{
    sideMenu.style.display = "none"
})

themeToggler.addEventListener('click',()=>{
     document.body.classList.toggle('dark-theme-variables')
     themeToggler.querySelector('span:nth-child(1').classList.toggle('active')
     themeToggler.querySelector('span:nth-child(2').classList.toggle('active')
})

document.addEventListener('DOMContentLoaded', function () {
    
    

    function fetchDataAndCreateChart() {
        fetch('http://127.0.0.1:5000/scrape')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                createSentimentChart(data.result);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function createSentimentChart(data) {
        const sentiments = data.map(item => item.sentiment);
        const sentimentCounts = countSentiments(sentiments);
        console.log(sentimentCounts);

        const sentimentCountsPositive = sentimentCounts.Positive;
        console.log("🚀 ~ file: script.js:50 ~ createSentimentChart ~ sentimentCountsPositive:", sentimentCountsPositive)
        const sentimentCountsNegative = sentimentCounts.Negative;
        console.log("🚀 ~ file: script.js:52 ~ createSentimentChart ~ sentimentCountsNegative:", sentimentCountsNegative)
        const sentimentCountsNeutral = sentimentCounts.Neutral;
        console.log("🚀 ~ file: script.js:54 ~ createSentimentChart ~ sentimentCountsNeutral:", sentimentCountsNeutral)

        document.getElementById('neutralCount').innerText = sentimentCountsNeutral;
        document.getElementById('positiveCount').innerText = sentimentCountsPositive;
        document.getElementById('negativeCount').innerText = sentimentCountsNegative;
        

        
        

        const ctx = document.getElementById('sentimentChart').getContext('2d');
        const sentimentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(sentimentCounts),
                datasets: [{
                    label: 'Sentiments',
                    data: Object.values(sentimentCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function countSentiments(sentiments) {
        return sentiments.reduce((count, sentiment) => {
            count[sentiment] = (count[sentiment] || 0) + 1;
            return count;
        }, {});
    }

    
    fetchDataAndCreateChart();

    
});
