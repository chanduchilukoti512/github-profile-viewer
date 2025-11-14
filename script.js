async function getUser() {
    const username = document.getElementById("usernameInput").value;
    const errorMsg = document.getElementById("errorMsg");
    const profile = document.getElementById("profileContainer");
    const repoList = document.getElementById("repoList");

    if (!username) {
        errorMsg.innerText = "Please enter a username!";
        return;
    }
    
    errorMsg.innerText = "";
    profile.classList.add("d-none");
    repoList.innerHTML = "";

    try {
        // Fetch profile data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        
        if (userRes.status === 404) {
            errorMsg.innerText = "User not found!";
            return;
        }

        const user = await userRes.json();

        // Set profile details
        document.getElementById("avatar").src = user.avatar_url;
        document.getElementById("name").innerText = user.name || "No Name";
        document.getElementById("bio").innerText = user.bio || "No bio available";
        document.getElementById("followers").innerText = user.followers;
        document.getElementById("following").innerText = user.following;
        document.getElementById("publicRepos").innerText = user.public_repos;
        document.getElementById("location").innerText = user.location || "Not provided";

        profile.classList.remove("d-none");

        // Fetch repos
        const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await repoRes.json();

        repos.forEach(repo => {
            repoList.innerHTML += `
                <div class="col-md-6">
                    <div class="card p-3 repo-card shadow-sm">
                        <h5><a href="${repo.html_url}" target="_blank">${repo.name}</a></h5>
                        <p>${repo.description || "No description"}</p>
                        <span class="badge bg-primary">⭐ ${repo.stargazers_count}</span>
                        <span class="badge bg-secondary">🍴 ${repo.forks_count}</span>
                        <span class="badge bg-success">${repo.language || "N/A"}</span>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        errorMsg.innerText = "Something went wrong!";
        console.log(error);
    }
}
