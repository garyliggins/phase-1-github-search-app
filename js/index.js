addEventListener("DOMContentLoaded", (event) => {

    const githubForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');
const toggleBtn = document.getElementById('toggleBtn');

let searchType = 'user'; // Default search type is user

githubForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        if (searchType === 'user') {
            await searchUsers(searchTerm);
        } else {
            await searchRepositories(searchTerm);
        }
    }
});

toggleBtn.addEventListener('click', () => {
    searchType = searchType === 'user' ? 'repo' : 'user';
    searchInput.placeholder = `Search for ${searchType === 'user' ? 'a GitHub user' : 'repositories'}`;
});

async function searchUsers(username) {
    const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    displayUsers(data.items);
}

async function searchRepositories(keyword) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${keyword}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    displayRepositories(data.items);
}

function displayUsers(users) {
    userList.innerHTML = '';
    reposList.innerHTML = ''; // Clear repos list when displaying users
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <h3>${user.login}</h3>
            <img src="${user.avatar_url}" alt="${user.login}'s avatar">
            <a href="${user.html_url}" target="_blank">View Profile</a>
        `;
        userItem.addEventListener('click', () => {
            getRepositories(user.login);
        });
        userList.appendChild(userItem);
    });
}

function displayRepositories(repos) {
    reposList.innerHTML = '';
    userList.innerHTML = ''; // Clear user list when displaying repositories
    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
            <h3>${repo.full_name}</h3>
            <p>${repo.description}</p>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
        reposList.appendChild(repoItem);
    });
}

async function getRepositories(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const repos = await response.json();
    displayRepositories(repos);
}

});