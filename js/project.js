import { a as slideDown, i as setHash, r as getHash, s as slideUp, t as dataMediaQueries } from "./main.js";
/* empty css       */
/* empty css          */
/* empty css       */
//#region src/components/layout/tabs/tabs.js
function tabs() {
	const tabs = document.querySelectorAll("[data-fls-tabs]");
	let tabsActiveHash = [];
	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add("--tab-init");
			tabsBlock.setAttribute("data-fls-tabs-index", index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});
		let mdQueriesArray = dataMediaQueries(tabs, "flsTabs");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector("[data-fls-tabs-titles]");
			let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-title]");
			let tabsContent = tabsMediaItem.querySelector("[data-fls-tabs-body]");
			let tabsContentItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-item]");
			tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add("--tab-spoller");
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove("--tab-spoller");
				}
			});
		});
	}
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-titles]>*");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-body]>*");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector("[data-fls-tabs-titles]>.--tab-active");
			tabsActiveTitle && tabsActiveTitle.classList.remove("--tab-active");
		}
		if (tabsContent.length) tabsContent.forEach((tabsContentItem, index) => {
			tabsTitles[index].setAttribute("data-fls-tabs-title", "");
			tabsContentItem.setAttribute("data-fls-tabs-item", "");
			if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("--tab-active");
			tabsContentItem.hidden = !tabsTitles[index].classList.contains("--tab-active");
		});
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-title]");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-item]");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute("data-fls-tabs-animate")) return tabsBlock.dataset.flsTabsAnimate > 0 ? Number(tabsBlock.dataset.flsTabsAnimate) : 500;
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute("data-fls-tabs-hash");
			tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains("--tab-active")) {
					if (tabsBlockAnimate) slideDown(tabsContentItem, tabsBlockAnimate);
					else tabsContentItem.hidden = false;
					if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
				} else if (tabsBlockAnimate) slideUp(tabsContentItem, tabsBlockAnimate);
				else tabsContentItem.hidden = true;
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-fls-tabs-title]")) {
			const tabTitle = el.closest("[data-fls-tabs-title]");
			const tabsBlock = tabTitle.closest("[data-fls-tabs]");
			if (!tabTitle.classList.contains("--tab-active") && !tabsBlock.querySelector(".--slide")) {
				let tabActiveTitle = tabsBlock.querySelectorAll("[data-fls-tabs-title].--tab-active");
				tabActiveTitle.length && (tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock));
				tabActiveTitle.length && tabActiveTitle[0].classList.remove("--tab-active");
				tabTitle.classList.add("--tab-active");
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
window.addEventListener("load", tabs);
//#endregion
//#region src/components/pages/project/project.js
function projectPagination() {
	const projectBlock = document.querySelector("[data-fls-project]");
	if (!projectBlock) return;
	const CARDS_PER_PAGE = 6;
	function getActiveTabBody() {
		const tabsBlock = projectBlock.querySelector("[data-fls-tabs]");
		if (!tabsBlock) return null;
		const tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-title]");
		const tabsBodies = tabsBlock.querySelectorAll("[data-fls-tabs-item]");
		let activeIndex = -1;
		tabsTitles.forEach((title, index) => {
			if (title.classList.contains("--tab-active")) activeIndex = index;
		});
		if (activeIndex === -1 || !tabsBodies[activeIndex]) return null;
		return tabsBodies[activeIndex];
	}
	function createPaginationHTML(totalPages, activePage) {
		const wrapper = document.createElement("div");
		wrapper.className = "project__pagination pagination";
		for (let i = 1; i <= totalPages; i++) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "pagination__item" + (i === activePage ? " _pagination-active" : "");
			btn.textContent = String(i).padStart(2, "0");
			wrapper.appendChild(btn);
		}
		return wrapper;
	}
	function initActiveTab() {
		const activeBody = getActiveTabBody();
		if (!activeBody) return;
		const grid = activeBody.querySelector(".project__grid");
		if (!grid) return;
		const oldPagination = activeBody.querySelector(".pagination");
		if (oldPagination) oldPagination.remove();
		const cards = Array.from(grid.querySelectorAll(":scope > .card-project"));
		const totalCards = cards.length;
		const totalPages = Math.ceil(totalCards / CARDS_PER_PAGE);
		cards.forEach((card) => {
			card.hidden = false;
		});
		if (totalCards <= CARDS_PER_PAGE) return;
		const pagination = createPaginationHTML(totalPages, 1);
		grid.after(pagination);
		cards.forEach((card, index) => {
			card.hidden = Math.floor(index / CARDS_PER_PAGE) + 1 !== 1;
		});
	}
	function setActivePage(pagination, page) {
		const pageButtons = pagination.querySelectorAll(".pagination__item");
		const totalPages = pageButtons.length;
		const grid = pagination.closest("[data-fls-tabs-item]").querySelector(".project__grid");
		if (!grid) return;
		if (page < 1 || page > totalPages) return;
		pageButtons.forEach((btn, index) => {
			btn.classList.remove("_pagination-active");
			if (index + 1 === page) btn.classList.add("_pagination-active");
		});
		grid.querySelectorAll(":scope > .card-project").forEach((card, index) => {
			card.hidden = Math.floor(index / CARDS_PER_PAGE) + 1 !== page;
		});
		const categoriesNav = projectBlock.querySelector(".project__categories-navigation");
		if (categoriesNav) categoriesNav.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
	projectBlock.addEventListener("click", (e) => {
		const paginationItem = e.target.closest(".pagination__item");
		if (!paginationItem) return;
		const pagination = paginationItem.closest(".pagination");
		if (!pagination) return;
		const pageNum = parseInt(paginationItem.textContent.trim());
		if (isNaN(pageNum)) return;
		setActivePage(pagination, pageNum);
	});
	const tabsNav = projectBlock.querySelector("[data-fls-tabs-titles]");
	if (tabsNav) tabsNav.addEventListener("click", () => {
		setTimeout(initActiveTab, 100);
	});
	setTimeout(initActiveTab, 200);
}
window.addEventListener("load", projectPagination);
//#endregion
