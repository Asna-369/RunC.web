document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('codeForm');
    const output = document.getElementById('output');
    const themeToggle = document.getElementById('themeToggle');
    const statusElement = document.getElementById('status');
    const runButton = document.getElementById('runButton');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    function adjustOutputHeight() {
        const lineCount = (output.textContent.match(/\n/g) || []).length + 1;
        output.style.height = `${Math.max(60, Math.min(lineCount * 20, 500))}px`;
    }

    form.onsubmit = async function(e) {
        e.preventDefault();
        const code = document.getElementById('codeInput').value.trim();
        
        if (!code) {
            output.textContent = "Please enter some C code to run.\n";
            adjustOutputHeight();
            return;
        }
        
        runButton.innerHTML = '<i class="fas fa-circle-notch loading"></i> Compiling...';
        runButton.disabled = true;
        statusElement.textContent = "Compiling...";
        
        output.textContent = "";
        output.classList.add('compiling-animation');
        const compilingText = document.createElement('div');
        compilingText.className = 'compiling-text';
        compilingText.textContent = "Compiling your C code...";
        output.appendChild(compilingText);
        
        try {
            const formData = new FormData(form);
            const response = await fetch('/run', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.text();
            
            output.classList.remove('compiling-animation');
            output.removeChild(compilingText);
            output.textContent = result || "No output generated.\n";
            
            if (result.includes("error:")) {
                output.innerHTML = output.textContent.replace(/error:/g, '<span style="color: #ff5555;">error:</span>');
                statusElement.textContent = "Compilation failed";
            } else {
                statusElement.textContent = "Execution completed";
            }
            
        } catch (error) {
            output.classList.remove('compiling-animation');
            if (output.contains(compilingText)) {
                output.removeChild(compilingText);
            }
            output.textContent = `Error: ${error.message}\n`;
            statusElement.textContent = "Error occurred";
        }
        
        adjustOutputHeight();
        runButton.innerHTML = '<i class="fas fa-play"></i> Run Code';
        runButton.disabled = false;
    }

    adjustOutputHeight();
});
