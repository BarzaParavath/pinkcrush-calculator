function playClickSound() {
    try {
        // Create audio context (reuse if exists)
        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const audioContext = window.audioContext;
        
        // Resume audio context if suspended (required for some browsers)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Create oscillator for the click sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure the sound - short click sound
        oscillator.frequency.value = 800; // Higher frequency for a click sound
        oscillator.type = 'sine';
        
        // Set gain envelope for a quick click
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        // Play the sound
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Fallback if AudioContext is not supported
        console.log('Audio not supported');
    }
}

// Add click sound to all calculator buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('input[type="button"]');
    const form = document.querySelector('form');
    const display = form.querySelector('input[name="display"]');
    
    // Make display accessible globally for eval (like inline onclick)
    window.display = display;
    
    buttons.forEach(button => {
        // Store original onclick handler code
        const originalOnclick = button.getAttribute('onclick');
        
        if (originalOnclick) {
            // Remove inline onclick
            button.removeAttribute('onclick');
            
            // Add event listener with click sound
            button.addEventListener('click', function() {
                // Play click sound
                playClickSound();
                
                // Execute original onclick logic
                try {
                    eval(originalOnclick);
                } catch (e) {
                    console.error('Error executing button action:', e);
                }
            });
        }
    });
});