// Enhanced PDF Preview for Eaton Product Page - Preview Only Version
// Removed PDF generation and download functionality, keeping only preview

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        RETRY_ATTEMPTS: 10,
        RETRY_DELAY: 500,
        BUTTON_POSITION: { bottom: '30px', right: '30px' },
        COLORS: {
            PRIMARY: '#0066cc',
            SECONDARY: '#004499',
            TEXT: '#000000',
            LIGHT_GRAY: '#808080'
        }
    };

    // Enhanced CSS with preview-only styling
    const styles = `
        #pdf-preview-button {
            position: fixed;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #28a745, #20692e);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
            z-index: 10000;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            bottom: ${CONFIG.BUTTON_POSITION.bottom};
            right: ${CONFIG.BUTTON_POSITION.right};
        }
        
        #pdf-preview-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(40, 167, 69, 0.5);
        }
        
        /* Preview Modal Styles */
        #pdf-preview-modal {
            display: none;
            position: fixed;
            z-index: 20000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
        }
        
        .pdf-preview-content {
            background-color: #ffffff;
            margin: 2% auto;
            padding: 0;
            border: none;
            border-radius: 10px;
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .pdf-preview-close {
            color: #fff;
            float: right;
            font-size: 28px;
            font-weight: bold;
            position: absolute;
            right: 20px;
            top: 15px;
            cursor: pointer;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .pdf-preview-close:hover {
            color: #ccc;
        }
        
        /* Preview Content Styles */
        .pdf-content {
            background: white;
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #333;
        }
        
        .pdf-header {
            background: linear-gradient(135deg, ${CONFIG.COLORS.PRIMARY}, ${CONFIG.COLORS.SECONDARY});
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        
        .pdf-header h1 {
            margin: 0 0 15px 0;
            font-size: 28px;
            font-weight: bold;
            line-height: 1.2;
        }
        
        .pdf-header p {
            margin: 0;
            font-size: 16px;
            line-height: 1.4;
            opacity: 0.9;
        }
        
        .pdf-body {
            padding: 40px 30px;
        }
        
        .pdf-section {
            margin-bottom: 40px;
        }
        
        .pdf-section h2 {
            color: ${CONFIG.COLORS.PRIMARY};
            border-bottom: 3px solid ${CONFIG.COLORS.PRIMARY};
            padding-bottom: 10px;
            margin-bottom: 25px;
            font-size: 20px;
            font-weight: bold;
        }
        
        .pdf-section h3 {
            color: ${CONFIG.COLORS.SECONDARY};
            margin: 25px 0 15px 0;
            font-size: 18px;
            font-weight: bold;
        }
        
        .pdf-image-container {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
            border: 2px solid #e9ecef;
            margin-bottom: 40px;
        }
        
        .pdf-product-image {
            max-width: 400px;
            max-height: 300px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .pdf-spec-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 14px;
        }
        
        .pdf-spec-table th,
        .pdf-spec-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            vertical-align: top;
        }
        
        .pdf-spec-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: ${CONFIG.COLORS.SECONDARY};
            width: 35%;
        }
        
        .pdf-spec-table tr:nth-child(even) {
            background-color: #fafafa;
        }
        
        .pdf-resource-list {
            list-style: none;
            padding-left: 0;
        }
        
        .pdf-resource-list li {
            margin-bottom: 12px;
            padding-left: 25px;
            position: relative;
            font-size: 14px;
        }
        
        .pdf-resource-list li:before {
            content: "📄";
            position: absolute;
            left: 0;
        }
        
        .pdf-resource-link {
            color: ${CONFIG.COLORS.PRIMARY};
            text-decoration: none;
            font-weight: 500;
        }
        
        .pdf-footer {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-top: 3px solid ${CONFIG.COLORS.PRIMARY};
            padding: 30px;
            text-align: center;
            margin-top: 40px;
        }
        
        .pdf-footer h3 {
            color: ${CONFIG.COLORS.PRIMARY};
            margin: 0 0 15px 0;
            font-size: 22px;
            font-weight: bold;
        }
        
        .pdf-footer p {
            margin: 8px 0;
            color: #555;
            font-size: 16px;
        }
        
        .pdf-footer a {
            color: ${CONFIG.COLORS.PRIMARY};
            text-decoration: none;
            font-weight: bold;
        }
        
        .pdf-footer-small {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
        
        .no-image-placeholder {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            color: #6c757d;
            font-style: italic;
            margin-bottom: 40px;
        }
        
        .preview-notice {
            background: linear-gradient(135deg, #28a745, #20692e);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            cursor: default;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }
    `;

    // Add styles to page
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Wait for DOM content to be fully loaded
    function waitForContent(callback, maxRetries = CONFIG.RETRY_ATTEMPTS) {
        if (maxRetries <= 0) {
            console.warn('Content loading timeout reached, proceeding with available content');
            callback();
            return;
        }
        
        const hasSpecs = document.querySelector('.product-specification-item') !== null;
        const hasResources = document.querySelector('.resource-list-item') !== null;
        const hasSupport = document.querySelector('.link-list-with-icon__element') !== null;
        
        if (hasSpecs || hasResources || hasSupport) {
            callback();
        } else {
            setTimeout(() => waitForContent(callback, maxRetries - 1), CONFIG.RETRY_DELAY);
        }
    }

    // Convert relative URL to absolute URL
    function makeAbsoluteURL(relativeUrl) {
        if (!relativeUrl) return null;
        
        if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
            return relativeUrl;
        }
        
        if (window.location.protocol === 'file:') {
            const currentPath = window.location.href;
            
            if (relativeUrl.startsWith('./')) {
                const cleanUrl = relativeUrl.substring(2);
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                return basePath + cleanUrl;
            } else if (relativeUrl.startsWith('/')) {
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                return basePath + relativeUrl.substring(1);
            } else {
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                return basePath + relativeUrl;
            }
        } else {
            if (relativeUrl.startsWith('./')) {
                const cleanUrl = relativeUrl.substring(2);
                const currentPath = window.location.pathname;
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                return window.location.origin + basePath + cleanUrl;
            } else if (relativeUrl.startsWith('/')) {
                return window.location.origin + relativeUrl;
            } else {
                const currentPath = window.location.pathname;
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                return window.location.origin + basePath + relativeUrl;
            }
        }
    }

    // Get all possible image URLs
    function getAllPossibleImageUrls(originalSrc) {
        const possibleUrls = [];
        const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        
        if (originalSrc) {
            possibleUrls.push({ url: originalSrc, description: 'Original URL' });
            
            const absoluteUrl = makeAbsoluteURL(originalSrc);
            if (absoluteUrl && absoluteUrl !== originalSrc) {
                possibleUrls.push({ url: absoluteUrl, description: 'Converted to absolute' });
            }
            
            const filename = originalSrc.split('/').pop();
            if (filename) {
                possibleUrls.push({ 
                    url: basePath + '9PX700RT _ Eaton 9PX UPS _ Eaton_files/9PX3K_L', 
                    description: 'Actual image from HTML content' 
                });
                
                ['jpg', 'jpeg', 'png', 'gif', 'webp'].forEach(ext => {
                    possibleUrls.push({ 
                        url: basePath + '9PX700RT _ Eaton 9PX UPS _ Eaton_files/9PX3K_L.' + ext, 
                        description: `Image with .${ext} extension` 
                    });
                });
                
                possibleUrls.push({ 
                    url: 'https://dynamicmedia.eaton.com/is/image/eaton/9PX3K_L?hei=500&wid=500&printRes=72&bfc=off', 
                    description: 'AEM Dynamic Media URL' 
                });
            }
        }
        
        return possibleUrls;
    }

    // Create floating button (preview only)
    function createFloatingButton() {
        // Preview Button Only
        const previewButton = document.createElement('button');
        previewButton.id = 'pdf-preview-button';
        previewButton.title = 'Preview Product Information';
        previewButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
            </svg>
        `;
        previewButton.addEventListener('click', showPreview);
        document.body.appendChild(previewButton);
        
        // Create preview modal
        createPreviewModal();
    }

    // Create preview modal
    function createPreviewModal() {
        const modal = document.createElement('div');
        modal.id = 'pdf-preview-modal';
        modal.innerHTML = `
            <div class="pdf-preview-content">
                <span class="pdf-preview-close">&times;</span>
                <div id="pdf-preview-body">
                    <!-- Content will be dynamically inserted here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.pdf-preview-close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Extract product information
    function extractProductInfo() {
        const productInfo = {
            name: 'Eaton Product',
            imageUrl: null,
            allPossibleImageUrls: [],
            description: ''
        };
        
        try {
            const titleElement = document.querySelector('.module-product-detail-card-v2__title');
            if (titleElement) {
                productInfo.name = titleElement.textContent.trim();
            }
            
            const imageSelectors = [
                '#large-model-image img.gallery-item-img',
                '.gallery-item-img',
                '.module-product-detail-card-v2 img',
                '.product-image img',
                'img[alt*="product"]'
            ];
            
            let imageElement = null;
            for (const selector of imageSelectors) {
                imageElement = document.querySelector(selector);
                if (imageElement && imageElement.src) {
                    productInfo.allPossibleImageUrls = getAllPossibleImageUrls(imageElement.src);
                    const dynamicMediaUrl = productInfo.allPossibleImageUrls.find(u => u.description === 'AEM Dynamic Media URL');
                    productInfo.imageUrl = dynamicMediaUrl ? dynamicMediaUrl.url : productInfo.allPossibleImageUrls[0]?.url;
                    break;
                }
            }
            
            const descElement = document.querySelector('.module-product-detail-card-v2__description-text');
            if (descElement) {
                productInfo.description = descElement.textContent.trim();
            }
        } catch (error) {
            console.warn('Error extracting product info:', error);
        }
        
        return productInfo;
    }

    // Extract specifications
    function extractSpecifications() {
        const specifications = [];
        
        try {
            const specContainers = document.querySelectorAll('.product-specification-item');
            
            specContainers.forEach(container => {
                const titleElement = container.querySelector('.product-specification-item__title');
                const title = titleElement ? titleElement.textContent.trim() : '';
                
                if (title) {
                    const specData = { title: title, items: [] };
                    
                    const rows = container.querySelectorAll('.specification-row');
                    rows.forEach(row => {
                        const titleCell = row.querySelector('.specification-title strong');
                        let valueCell = row.querySelector('.specification-value .specification-value-secondary');
                        
                        if (!valueCell) {
                            valueCell = row.querySelector('.specification-value .module-table__value');
                        }
                        if (!valueCell) {
                            valueCell = row.querySelector('.specification-value');
                        }
                        
                        if (titleCell) {
                            const itemTitle = titleCell.textContent.trim();
                            let itemValue = 'Not specified';
                            
                            if (valueCell) {
                                const listItems = valueCell.querySelectorAll('li');
                                if (listItems.length > 0) {
                                    itemValue = Array.from(listItems).map(li => li.textContent.trim()).join('; ');
                                } else {
                                    itemValue = valueCell.textContent.trim();
                                }
                                
                                itemValue = itemValue.replace(/\s+/g, ' ').trim();
                                if (itemValue === '' || itemValue === 'undefined') {
                                    itemValue = 'Not specified';
                                }
                            }
                            
                            if (itemTitle) {
                                specData.items.push({ title: itemTitle, value: itemValue });
                            }
                        }
                    });
                    
                    if (specData.items.length > 0) {
                        specifications.push(specData);
                    }
                }
            });
        } catch (error) {
            console.warn('Error extracting specifications:', error);
        }
        
        return specifications;
    }

    // Extract resources
    function extractResources() {
        const resources = [];
        
        try {
            const resourceItems = document.querySelectorAll('.resource-list-item');
            
            resourceItems.forEach(item => {
                const titleElement = item.querySelector('.resource-list-item__title');
                const title = titleElement ? titleElement.textContent.trim() : '';
                
                if (title) {
                    const resourceData = { title: title, links: [] };
                    
                    const links = item.querySelectorAll('.resource-list__title-link');
                    links.forEach(link => {
                        const linkTitle = link.textContent.trim();
                        const linkUrl = link.href;
                        
                        if (linkTitle && linkUrl) {
                            resourceData.links.push({ title: linkTitle, url: linkUrl });
                        }
                    });
                    
                    if (resourceData.links.length > 0) {
                        resources.push(resourceData);
                    }
                }
            });
        } catch (error) {
            console.warn('Error extracting resources:', error);
        }
        
        return resources;
    }

    // Extract support
    function extractSupport() {
        const support = [];
        
        try {
            const supportElements = document.querySelectorAll('.link-list-with-icon__element');
            
            supportElements.forEach(element => {
                const titleElement = element.querySelector('.link-list-with-icon__item-title');
                const textElement = element.querySelector('.link-list-with-icon__text');
                
                if (titleElement) {
                    const title = titleElement.textContent.trim();
                    const text = textElement ? textElement.textContent.trim() : '';
                    const link = titleElement.tagName === 'A' ? titleElement.href : '';
                    
                    if (title) {
                        support.push({ title: title, text: text, link: link });
                    }
                }
            });
        } catch (error) {
            console.warn('Error extracting support info:', error);
        }
        
        return support;
    }

    // Generate preview content HTML
    function generatePreviewContentHTML(productInfo, specifications, resources, support) {
        let html = `
            <div class="pdf-content" id="pdf-preview-content">
                <div class="pdf-header">
                    <h1>${productInfo.name}</h1>
                    ${productInfo.description ? `<p>${productInfo.description}</p>` : ''}
                </div>
                <div class="pdf-body">
        `;
        
        // Add product image
        if (productInfo.imageUrl) {
            html += `
                <div class="pdf-image-container">
                    <img src="${productInfo.imageUrl}" alt="${productInfo.name}" class="pdf-product-image" />
                </div>
            `;
        } else {
            html += `
                <div class="no-image-placeholder">
                    <div style="font-size: 48px; margin-bottom: 10px;">🖼️</div>
                    <p>No product image available</p>
                </div>
            `;
        }
        
        // Add specifications
        if (specifications.length > 0) {
            html += '<div class="pdf-section"><h2>Technical Specifications</h2>';
            specifications.forEach(spec => {
                html += `<h3>${spec.title}</h3>`;
                if (spec.items.length > 0) {
                    html += '<table class="pdf-spec-table"><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody>';
                    spec.items.forEach(item => {
                        html += `<tr><th>${item.title}</th><td>${item.value}</td></tr>`;
                    });
                    html += '</tbody></table>';
                }
            });
            html += '</div>';
        }
        
        // Add resources
        if (resources.length > 0) {
            html += '<div class="pdf-section"><h2>Resources & Documentation</h2>';
            resources.forEach(resource => {
                html += `<h3>${resource.title}</h3><ul class="pdf-resource-list">`;
                resource.links.forEach(link => {
                    html += `<li><a href="${link.url}" class="pdf-resource-link">${link.title}</a></li>`;
                });
                html += '</ul>';
            });
            html += '</div>';
        }
        
        // Add support
        if (support.length > 0) {
            html += '<div class="pdf-section"><h2>Support & Services</h2>';
            html += '<table class="pdf-spec-table"><thead><tr><th>Service</th><th>Description</th><th>Access</th></tr></thead><tbody>';
            support.forEach(item => {
                html += `
                    <tr>
                        <th>${item.title}</th>
                        <td>${item.text}</td>
                        <td>${item.link ? `<a href="${item.link}" class="pdf-resource-link">Access Service</a>` : 'N/A'}</td>
                    </tr>
                `;
            });
            html += '</tbody></table></div>';
        }

        // Add Eaton promotional footer
        html += `
                <div class="pdf-footer">
                    <h3>🔌 Eaton - Power Management Solutions</h3>
                    <p>Visit <a href="https://www.eaton.com">www.eaton.com</a> for more product information</p>
                    <p>Contact us for technical support and product customization</p>
                    <div class="pdf-footer-small">
                        Preview generated on ${new Date().toLocaleDateString()} | © ${new Date().getFullYear()} Eaton Corporation
                    </div>
                </div>
                </div>
            </div>
        `;
        
        return html;
    }

    // Show preview (main function - no PDF generation)
    async function showPreview() {
        try {
            const productInfo = extractProductInfo();
            const specifications = extractSpecifications();
            const resources = extractResources();
            const support = extractSupport();
            
            const previewHTML = generatePreviewContentHTML(productInfo, specifications, resources, support);
            
            const modal = document.getElementById('pdf-preview-modal');
            const previewBody = document.getElementById('pdf-preview-body');
            previewBody.innerHTML = previewHTML;
            modal.style.display = 'block';
            
        } catch (error) {
            console.error('Error creating preview:', error);
            alert('Error creating preview: ' + error.message);
        }
    }

    // Make function globally accessible
    window.showPreview = showPreview;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }

})();