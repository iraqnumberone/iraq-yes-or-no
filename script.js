// Voting functionality for the Yes/No page
class VotingApp {
    constructor() {
        this.isAnimating = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.applySavedSelection();
    }
    
    initializeElements() {
        this.yesBtn = document.getElementById('yesBtn');
        this.noBtn = document.getElementById('noBtn');
        this.voteOptions = document.getElementById('voteOptions');
        this.resultsView = document.getElementById('resultsView');
        this.mainHeader = document.getElementById('mainHeader');
        // Results elements (exist only on index inline results)
        this.totalEl = document.getElementById('totalVotes');
        this.yesPctEl = document.getElementById('yesPercent');
        this.noPctEl = document.getElementById('noPercent');
        this.yesVotesEl = document.getElementById('yesVotes');
        this.noVotesEl = document.getElementById('noVotes');
        this.closeVideoModalBtn = document.getElementById('closeVideoModal');
        this.videoModal = document.getElementById('videoModal');
        this.randomVideo = document.getElementById('randomVideo');
        this.timerDisplay = null;
        this.countdownInterval = null;
        this.videoFiles = ['1.mp4', '2.mp4', '3.mp4'];
    }
    
    setupEventListeners() {
        this.yesBtn.addEventListener('click', () => this.vote('yes'));
        this.noBtn.addEventListener('click', () => this.vote('no'));
        if (this.closeVideoModalBtn) {
            this.closeVideoModalBtn.addEventListener('click', () => this.closeVideoModal());
        }
        // Close modal when clicking outside video content
        if (this.videoModal) {
            this.videoModal.addEventListener('click', (e) => {
                if (e.target === this.videoModal) {
                    this.closeVideoModal();
                }
            });
        }
    }
    
    vote(type) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const button = type === 'yes' ? this.yesBtn : this.noBtn;

        // Add click animation
        button.style.transform = 'scale(0.95)';
        
        // Animate the ripple effect
        const ripple = button.querySelector('.btn-ripple');
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        
        // Feedback + selection after animation
        setTimeout(() => {
            this.updateSelection(type);
            localStorage.setItem('selectedVote', type);
            this.persistVote(type);
            this.showVoteFeedback(type);
            
            // Reset button state
            button.style.transform = '';
            ripple.style.width = '0';
            ripple.style.height = '0';
            
            this.isAnimating = false;
            // Show inline results and start timer
            this.showResultsInline();
        }, 300);
    }

    updateSelection(type) {
        // Clear both, then select one
        this.yesBtn.classList.remove('selected');
        this.noBtn.classList.remove('selected');
        if (type === 'yes') this.yesBtn.classList.add('selected');
        if (type === 'no') this.noBtn.classList.add('selected');
    }

    applySavedSelection() {
        const saved = localStorage.getItem('selectedVote');
        if (saved === 'yes' || saved === 'no') {
            this.updateSelection(saved);
        }
    }
    
    persistVote(type) {
        const yes = parseInt(localStorage.getItem('yesVotes') || '0', 10);
        const no = parseInt(localStorage.getItem('noVotes') || '0', 10);
        if (type === 'yes') {
            localStorage.setItem('yesVotes', String(yes + 1));
        } else {
            localStorage.setItem('noVotes', String(no + 1));
        }
    }

    showResultsInline() {
        if (!this.resultsView || !this.voteOptions) return;
        this.voteOptions.style.display = 'none';
        this.resultsView.style.display = 'block';
        this.resultsView.setAttribute('aria-hidden', 'false');
        if (this.mainHeader) this.mainHeader.style.display = 'none';
        this.renderResults();
        // Start countdown timer
        this.startTimer();
    }

    renderResults() {
        if (!this.totalEl) return;
        const yes = parseInt(localStorage.getItem('yesVotes') || '0', 10);
        const no = parseInt(localStorage.getItem('noVotes') || '0', 10);
        const total = yes + no;
        const yesPct = total > 0 ? (yes / total) * 100 : 0;
        const noPct = total > 0 ? (no / total) * 100 : 0;

        this.totalEl.textContent = String(total);
        this.yesPctEl.textContent = `${yesPct.toFixed(1)}%`;
        this.noPctEl.textContent = `${noPct.toFixed(1)}%`;
        this.yesVotesEl.textContent = `${yes} votes`;
        this.noVotesEl.textContent = `${no} votes`;

        requestAnimationFrame(() => {
            if (this.yesBar) this.yesBar.style.width = `${yesPct}%`;
            if (this.noBar) this.noBar.style.width = `${noPct}%`;
        });
    }
    
    showVoteFeedback(type) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = `${type.toUpperCase()}!`;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: bold;
            color: ${type === 'yes' ? '#4CAF50' : '#f44336'};
            text-shadow: 0 0 20px rgba(0,0,0,0.5);
            pointer-events: none;
            z-index: 1000;
            animation: voteFeedback 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(feedback);
        
        // Remove feedback after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1500);
    }

    startTimer() {
        // Create timer display if it doesn't exist
        if (!this.timerDisplay) {
            this.timerDisplay = document.createElement('div');
            this.timerDisplay.style.cssText = `
                text-align: center;
                font-size: 1.2rem;
                font-weight: 600;
                color: #4CAF50;
                margin: 20px 0;
                animation: pulse 1s ease-in-out infinite;
            `;
            // Insert after results container
            this.resultsView.appendChild(this.timerDisplay);
        }

        let countdown = 1; // 1 second countdown
        this.timerDisplay.textContent = `سيظهر فيديو خلال ${countdown} ثوان...`;

        this.countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                this.timerDisplay.textContent = `سيظهر فيديو خلال ${countdown} ثوان...`;
            } else {
                this.timerDisplay.textContent = 'جاري تحميل الفيديو...';
                clearInterval(this.countdownInterval);
                // Show random video immediately
                this.showRandomVideo();
            }
        }, 1000);
    }

    showRandomVideo() {
        if (!this.videoModal || !this.randomVideo) return;

        // Select random video
        const randomIndex = Math.floor(Math.random() * this.videoFiles.length);
        const selectedVideo = this.videoFiles[randomIndex];

        // Set video source
        this.randomVideo.src = selectedVideo;

        // Show modal
        this.videoModal.style.display = 'flex';

        // Remove timer display
        if (this.timerDisplay && this.timerDisplay.parentNode) {
            this.timerDisplay.parentNode.removeChild(this.timerDisplay);
            this.timerDisplay = null;
        }
    }

    closeVideoModal() {
        if (!this.videoModal || !this.randomVideo) return;

        // Hide modal
        this.videoModal.style.display = 'none';

        // Stop video
        this.randomVideo.pause();
        this.randomVideo.currentTime = 0;
        this.randomVideo.src = '';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VotingApp();
});

// Add CSS for vote feedback animation
const style = document.createElement('style');
style.textContent = `
    @keyframes voteFeedback {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Add some additional interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle animation to the title
    const title = document.querySelector('.vote-title');
    setInterval(() => {
        title.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            title.style.transform = 'translateY(0)';
        }, 500);
    }, 3000);
    
    // No stats in this mock
});

// Keyboard support for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'y' || e.key === 'Y') {
        document.getElementById('yesBtn').click();
    } else if (e.key === 'n' || e.key === 'N') {
        document.getElementById('noBtn').click();
    }
});
