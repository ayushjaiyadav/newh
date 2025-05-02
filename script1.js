// Draw connector lines when the page loads
window.onload = function() {
    const center = { 
        x: 300, 
        y: 300 
    };
    
    const nodes = [
        { id: 'qms-node', element: document.getElementById('qms-node') },
        { id: 'ehsms-node', element: document.getElementById('ehsms-node') },
        { id: 'eams-node', element: document.getElementById('eams-node') },
        { id: 'ohms-node', element: document.getElementById('ohms-node') },
        { id: 'ass-node', element: document.getElementById('ass-node') }
    ];
    
    // Create connector for each node to center
    nodes.forEach(node => {
        const element = node.element;
        const rect = element.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        
        const nodeX = rect.left + rect.width / 2 - containerRect.left;
        const nodeY = rect.top + rect.height / 2 - containerRect.top;
        
        // Calculate angle and distance
        const dx = center.x - nodeX;
        const dy = center.y - nodeY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Create line element
        const line = document.createElement('div');
        line.className = 'connector';
        line.style.width = `${distance}px`;
        line.style.height = '3px';
        line.style.left = `${nodeX}px`;
        line.style.top = `${nodeY}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        document.querySelector('.container').appendChild(line);
    });
    
    // Center IMS circle functionality
    const centerCircle = document.querySelector('.center-circle');
    
    // Create connectors for HV and LV side plugins
    const centerPlugins = centerCircle.querySelectorAll('.plugin');
    centerPlugins.forEach(plugin => {
        // Create connector only when the center circle is active (plugins are visible)
        centerCircle.addEventListener('click', function(e) {
            // If already has connector, don't create again
            if (plugin.querySelector('.plugin-connector')) return;
            
            setTimeout(() => {
                if (centerCircle.classList.contains('active')) {
                    const pluginRect = plugin.getBoundingClientRect();
                    const centerRect = centerCircle.getBoundingClientRect();
                    const containerRect = document.querySelector('.container').getBoundingClientRect();
                    
                    const pluginX = pluginRect.left + pluginRect.width / 2 - containerRect.left;
                    const pluginY = pluginRect.top + pluginRect.height / 2 - containerRect.top;
                    const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
                    const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;
                    
                    // Calculate angle and distance
                    const dx = centerX - pluginX;
                    const dy = centerY - pluginY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    
                    // Create line element
                    const line = document.createElement('div');
                    line.className = 'plugin-connector';
                    line.style.width = `${distance}px`;
                    line.style.left = `${pluginX}px`;
                    line.style.top = `${pluginY}px`;
                    line.style.transform = `rotate(${angle}deg)`;
                    
                    document.querySelector('.container').appendChild(line);
                    
                    // Store reference to connector in plugin
                    plugin.connector = line;
                } else {
                    // Remove connectors when center circle is deactivated
                    document.querySelectorAll('.plugin-connector').forEach(conn => {
                        conn.remove();
                    });
                }
            }, 50); // Small delay to ensure plugin positions are updated
        });
    });
    
    // Toggle plugins visibility when clicking on center circle
    centerCircle.addEventListener('click', function(e) {
        // If clicking on a plugin link, don't toggle
        if (e.target.classList.contains('plugin')) {
            return;
        }
        
        // Hide plugins on all nodes
        nodes.forEach(node => {
            node.element.classList.remove('active');
        });
        
        // Toggle active class on center circle
        this.classList.toggle('active');
        
        // If center circle is not active, remove plugin connectors
        if (!this.classList.contains('active')) {
            document.querySelectorAll('.plugin-connector').forEach(conn => {
                conn.remove();
            });
        }
    });
    
    // Add hover effects to center circle
    centerCircle.addEventListener('mouseover', function() {
        this.style.boxShadow = '0 0 20px rgba(255,255,255,0.7)';
        
        // Show tooltip with center circle info
        tooltip.innerHTML = `<h3>Integrated Management System</h3>
                             <p>Central framework that integrates all management systems for streamlined governance and operational excellence.</p>`;
        tooltip.classList.add('visible');
        
        // Position tooltip
        const rect = this.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        
        tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - containerRect.top - tooltip.offsetHeight - 10}px`;
    });
    
    centerCircle.addEventListener('mouseout', function() {
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        tooltip.classList.remove('visible');
    });
    
    // Center circle plugin information
    const centerPluginInfo = {
        'HV Side': 'High Voltage systems and equipment management, including substations, transformers, and distribution networks.',
        'LV Side': 'Low Voltage systems and equipment management, including consumer connections, indoor wiring, and end-user appliances.'
    };
    
    // Add tooltip functionality to center circle plugins
    centerCircle.querySelectorAll('.plugin').forEach(plugin => {
        const pluginText = plugin.textContent.trim();
        const info = centerPluginInfo[pluginText];
        
        plugin.addEventListener('mouseover', function(e) {
            e.stopPropagation(); // Prevent triggering parent's mouseover
            
            // Show tooltip with plugin info
            tooltip.innerHTML = `<h3>${pluginText}</h3><p>${info}</p>`;
            tooltip.classList.add('visible');
            
            // Position tooltip next to the plugin
            const rect = this.getBoundingClientRect();
            const containerRect = document.querySelector('.container').getBoundingClientRect();
            
            tooltip.style.left = `${rect.right - containerRect.left + 10}px`;
            tooltip.style.top = `${rect.top - containerRect.top}px`;
        });
        
        plugin.addEventListener('mouseout', function(e) {
            e.stopPropagation();
            tooltip.classList.remove('visible');
        });
        
        // Prevent center circle toggle when clicking plugin
        plugin.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Node information for tooltips
    const nodeInfo = {
        'qms-node': {
            title: 'Quality Management System',
            description: 'Focuses on meeting customer requirements and enhancing satisfaction through continuous improvement.',
            plugins: {
                'ISO 9001': 'International standard for quality management systems (QMS).',
                'QMS Docs': 'Access all quality management documentation and procedures.'
            }
        },
        'ehsms-node': {
            title: 'Environmental Management System',
            description: 'Helps organizations minimize their environmental impact and comply with regulations.',
            plugins: {
                'ISO 14001': 'International standard for environmental management systems.',
                'Env Policy': 'View and download the organizational environmental policy.'
            }
        },
        'eams-node': {
            title: 'Energy Management System',
            description: 'Helps organizations optimize their energy use and reduce consumption.',
            plugins: {
                'ISO 50001': 'International standard for energy management systems.',
                'Energy Docs': 'Access energy usage reports and conservation strategies.'
            }
        },
        'ohms-node': {
            title: 'Occupational Health Management System',
            description: 'Focuses on workplace safety and reducing occupational injuries and illnesses.',
            plugins: {
                'ISO 45001': 'International standard for occupational health and safety.',
                'Safety Docs': 'Access safety protocols, incident reports, and hazard assessments.'
            }
        },
        'ass-node': {
            title: 'Asset Management',
            description: 'Optimizes the lifecycle of physical assets to maximize value and minimize risks.',
            plugins: {
                'ISO 55001': 'International standard for asset management systems.',
                'Asset Docs': 'Access asset registers, maintenance schedules, and lifecycle plans.'
            }
        }
    };
    
    const tooltip = document.querySelector('.tooltip');
    
    // Add interactivity - highlight connections on hover and show/hide plugins
    nodes.forEach(node => {
        const element = node.element;
        
        // Toggle plugins visibility when clicking on a node
        element.addEventListener('click', function(e) {
            // If clicking on a plugin link, don't toggle
            if (e.target.classList.contains('plugin')) {
                return;
            }
            
            // Hide plugins on all other nodes
            nodes.forEach(otherNode => {
                if (otherNode.element !== this) {
                    otherNode.element.classList.remove('active');
                }
            });
            
            // Toggle active class on clicked node
            this.classList.toggle('active');
        });
        
        // Show hover effects and tooltip
        element.addEventListener('mouseover', function() {
            this.style.zIndex = 3;
            this.style.boxShadow = '0 0 20px rgba(255,255,255,0.7)';
            
            // Show tooltip with node info
            const info = nodeInfo[this.id];
            tooltip.innerHTML = `<h3>${info.title}</h3><p>${info.description}</p>`;
            tooltip.classList.add('visible');
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            const containerRect = document.querySelector('.container').getBoundingClientRect();
            
            tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - containerRect.top - tooltip.offsetHeight - 10}px`;
            
            // If tooltip would go off the top, position it below
            if (rect.top - containerRect.top < tooltip.offsetHeight + 20) {
                tooltip.style.top = `${rect.bottom - containerRect.top + 10}px`;
            }
        });
        
        // Hide tooltip on mouseout
        element.addEventListener('mouseout', function() {
            this.style.zIndex = 1;
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            tooltip.classList.remove('visible');
        });
    });
    
    // Add tooltip functionality to plugins
    document.querySelectorAll('.plugin').forEach(plugin => {
        const parentNodeId = plugin.parentElement.id;
        if (!parentNodeId) return; // Skip center circle plugins as they're handled separately
        
        const pluginText = plugin.textContent.trim();
        const info = nodeInfo[parentNodeId].plugins[pluginText];
        
        plugin.addEventListener('mouseover', function(e) {
            e.stopPropagation(); // Prevent triggering parent node's mouseover
            
            // Show tooltip with plugin info
            tooltip.innerHTML = `<h3>${pluginText}</h3><p>${info}</p>`;
            tooltip.classList.add('visible');
            
            // Position tooltip next to the plugin
            const rect = this.getBoundingClientRect();
            const containerRect = document.querySelector('.container').getBoundingClientRect();
            
            tooltip.style.left = `${rect.right - containerRect.left + 10}px`;
            tooltip.style.top = `${rect.top - containerRect.top}px`;
        });
        
        plugin.addEventListener('mouseout', function(e) {
            e.stopPropagation();
            tooltip.classList.remove('visible');
        });
        
        // Prevent node toggle when clicking plugin
        plugin.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Close all plugins when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.node') && !e.target.closest('.center-circle')) {
            nodes.forEach(node => {
                node.element.classList.remove('active');
            });
            centerCircle.classList.remove('active');
            
            // Remove plugin connectors
            document.querySelectorAll('.plugin-connector').forEach(conn => {
                conn.remove();
            });
        }
    });
};