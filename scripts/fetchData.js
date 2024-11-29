document.addEventListener("DOMContentLoaded", async () => {
    const preloader = document.getElementById("preloader");
    const recommendationsList = document.querySelector(".friend-recomedations");

    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    recommendationsList.appendChild(errorMessage);

    preloader.style.display = "block";    

    try {
        const response = await fetch(`https://run.mocky.io/v3/c102cbb7-b5cf-4804-9a2a-5d41682a1583`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();
        recommendationsList.innerHTML = '';

        getFilteredFriends(data, 2).forEach(friend => {
            const listItem = createFriendListItem(friend);
            recommendationsList.appendChild(listItem);
        });
    } catch (error) {
        errorMessage.textContent = '⚠ Что-то пошло не так';
        errorMessage.style.display = "block"; 
    } finally {
        preloader.style.display = "none";
    }
});

function getFilteredFriends(friends, count) {
    // Перемешиваем массив
    const shuffled = friends.sort(() => 0.5 - Math.random());
    // Возвращаем первые `count` элементов
    return shuffled.slice(0, count);
}

function createFriendListItem(friend) {
    const listItem = document.createElement('li');
    listItem.className = 'content-list-item shadow';

    const postHeader = createPostHeader(friend.name);
    listItem.appendChild(postHeader);

    const userStats = createUserStats(friend.stats);
    listItem.appendChild(userStats);

    const userInfo = createUserInfo(friend.city, friend.favoriteClimbingWall);
    listItem.appendChild(userInfo);

    const addFriendButton = document.createElement('button');
    addFriendButton.className = 'add-friend-button';
    addFriendButton.textContent = 'Добавить в друзья';
    listItem.appendChild(addFriendButton);

    return listItem;
}

function createPostHeader(name) {
    const postHeader = document.createElement('div');
    postHeader.className = 'l-post-header';

    const avatarImg = document.createElement('img');
    avatarImg.src = "resources/avatar.png";
    avatarImg.alt = "Аватар";
    avatarImg.className = "user-avatar";

    const userNameLink = document.createElement('a');
    userNameLink.className = 'user-name';
    userNameLink.textContent = name;

    postHeader.appendChild(avatarImg);
    postHeader.appendChild(userNameLink);

    return postHeader;
}

function createUserStats(stats) {
    const userStatsContainer = document.createDocumentFragment();

    const routesCompleted = document.createElement('p');
    routesCompleted.className = 'user-stats';
    routesCompleted.textContent = `Пройдено трасс: ${stats.routesCompleted}`;
    
    const averageDifficulty = document.createElement('p');
    averageDifficulty.className = 'user-stats';
    averageDifficulty.textContent = `Средняя сложность: ${stats.averageDifficulty}`;

    userStatsContainer.appendChild(routesCompleted);
    userStatsContainer.appendChild(averageDifficulty);

    return userStatsContainer;
}

function createUserInfo(city, favoriteClimbingWall) {
    const userInfoContainer = document.createDocumentFragment();

    const cityInfo = document.createElement('p');
    cityInfo.className = 'user-info';
    cityInfo.textContent = `Город: ${city}`;

    const climbingWallInfo = document.createElement('p');
    climbingWallInfo.className = 'user-info';
    
    climbingWallInfo.textContent = `Любимый скалодром: `;
    
    const climbingWallLink = document.createElement('a');
    climbingWallLink.className = 'climbing-wall';
    climbingWallLink.textContent = favoriteClimbingWall.name;
    climbingWallLink.href = favoriteClimbingWall.link;

    climbingWallInfo.appendChild(climbingWallLink);
    
    userInfoContainer.appendChild(cityInfo);
    userInfoContainer.appendChild(climbingWallInfo);

    return userInfoContainer;
}