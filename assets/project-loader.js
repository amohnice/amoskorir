document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        window.location.href = 'index.html';
        return;
    }

    // Helper function to show error UI
    const showError = (title, message, showRetry = false) => {
        const errorHTML = `
            <div style="text-align: center; margin-top: 20vh; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h1 style="color: var(--text-color); margin-bottom: 15px;">${title}</h1>
                <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 30px;">${message}</p>
                <div>
                    <a href="index.html" class="btn btn-primary" style="text-decoration: none; margin-right: 10px;">
                        <i class="fas fa-home"></i> Go Home
                    </a>
                    ${showRetry ? '<button onclick="location.reload()" class="btn btn-secondary"><i class="fas fa-redo"></i> Try Again</button>' : ''}
                </div>
            </div>
        `;
        document.getElementById('project-container').innerHTML = errorHTML;
    };

    try {
        const response = await fetch('assets/projects.json');
        if (!response.ok) throw new Error('Failed to load projects');

        const projects = await response.json();
        const projectIndex = projects.findIndex(p => p.id === projectId);
        const project = projects[projectIndex];

        if (!project) {
            showError(
                'Project Not Found',
                'The project you\'re looking for doesn\'t exist. It may have been removed or the link is incorrect.'
            );
            return;
        }

        // Set Title
        document.title = `${project.title} | Amos Korir Portfolio`;
        document.getElementById('project-title').textContent = project.title;

        // Set Basic SEO Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = project.seoDescription || project.about;

        // Set Open Graph tags
        const ogTags = {
            'og:title': project.title,
            'og:description': project.seoDescription || project.about,
            'og:image': new URL(project.heroImage, window.location.origin).href,
            'og:url': window.location.href,
            'og:type': 'website'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.content = content;
        });

        // Set Twitter Card tags
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': project.title,
            'twitter:description': project.seoDescription || project.about,
            'twitter:image': new URL(project.heroImage, window.location.origin).href
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.name = name;
                document.head.appendChild(tag);
            }
            tag.content = content;
        });

        // Set Hero Image
        const heroImg = document.getElementById('project-hero-img');
        if (heroImg) {
            heroImg.src = project.heroImage;
            heroImg.alt = project.title;
        }



        // Set About
        const aboutElement = document.getElementById('project-about');
        aboutElement.textContent = project.about;

        // Set Live Demo & Source Links
        const demoLinks = document.querySelectorAll('.live-demo-link');
        demoLinks.forEach(link => link.href = project.liveDemo);

        const sourceLink = document.getElementById('source-code-link');
        if (sourceLink) sourceLink.href = project.sourceCode;

        // Set Features
        const featuresList = document.getElementById('project-features');
        featuresList.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.style.marginBottom = '15px';
            li.innerHTML = `<i class="${feature.icon}" style="color: var(--accent-color); margin-right: 10px;"></i> <strong>${feature.title}:</strong> ${feature.desc}`;
            featuresList.appendChild(li);
        });

        // Set Tech Stack
        const techList = document.getElementById('project-tech-stack');
        techList.innerHTML = '';
        project.techStack.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech;
            techList.appendChild(span);
        });

        // Project Navigation (Prev/Next)
        const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
        const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

        const navContainer = document.getElementById('project-navigation');
        if (navContainer) {
            const prevBtn = navContainer.querySelector('.nav-prev');
            const nextBtn = navContainer.querySelector('.nav-next');

            if (prevBtn && prevProject) {
                prevBtn.href = `project.html?id=${prevProject.id}`;
                prevBtn.style.display = 'flex';
                prevBtn.querySelector('.nav-label').textContent = prevProject.title;
            } else if (prevBtn) {
                prevBtn.style.display = 'none';
            }

            if (nextBtn && nextProject) {
                nextBtn.href = `project.html?id=${nextProject.id}`;
                nextBtn.style.display = 'flex';
                nextBtn.querySelector('.nav-label').textContent = nextProject.title;
            } else if (nextBtn) {
                nextBtn.style.display = 'none';
            }
        }

    } catch (error) {
        console.error('Error loading project data:', error);
        showError(
            'Error Loading Project',
            'We encountered an issue while loading the project. Please check your connection and try again.',
            true
        );
    }
});
