import { 
  Component, 
  AfterViewInit, 
  ElementRef, 
  ViewChild 
} from '@angular/core';
import Swiper from 'swiper';
import Shuffle from 'shufflejs';

@Component({
  selector: 'app-front-office-layout',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  
  @ViewChild('header', { static: true }) header!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('videoPlayBtn') videoPlayBtn!: ElementRef;
  
  ngAfterViewInit() {
    this.initStickyHeader();
    this.initSwiper();
    this.initTabs();
    this.initCounter();
    this.initAccordion();
    this.initShuffle();
    this.initVideoPlayer();
  }

  // Sticky Header
  private initStickyHeader(): void {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        this.header.nativeElement.classList.add("header-sticky");
      } else {
        this.header.nativeElement.classList.remove("header-sticky");
      }
    });
  }

  // Swiper Carousels
  private initSwiper(): void {
    new Swiper(".reviews-carousel", {
      loop: true,
      spaceBetween: 20,
      pagination: { el: ".reviews-carousel-pagination", clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }
    });

    new Swiper(".auth-banner-carousel", {
      slidesPerView: 1,
      pagination: { el: ".auth-banner-carousel .pagination", type: "bullets", clickable: true }
    });
  }

  // Tabs
  private initTabs(): void {
    const tabGroups = document.querySelectorAll("[data-tab-group]");
    tabGroups.forEach(tabGroup => {
      const tabsNav = tabGroup.querySelector("[data-tab-nav]") as HTMLElement | null;
      if (!tabsNav) return;
      
      const tabsNavItem = tabsNav.querySelectorAll("[data-tab]");
      const activeTabName = localStorage.getItem(`activeTabName-${tabGroup.getAttribute("data-tab-group")}`) 
        || tabsNavItem[0]?.getAttribute("data-tab");

      if (activeTabName) {
        this.setActiveTab(tabGroup as HTMLElement, activeTabName);
      }

      tabsNavItem.forEach(tabNavItem => {
        tabNavItem.addEventListener("click", e => {
          e.preventDefault();
          const tabName = tabNavItem.getAttribute("data-tab");
          if (tabName) {
            this.setActiveTab(tabGroup as HTMLElement, tabName);
            localStorage.setItem(`activeTabName-${tabGroup.getAttribute("data-tab-group")}`, tabName);
          }
        });
      });
    });
  }

  private setActiveTab(tabGroup: HTMLElement, tabName: string): void {
    const tabsNav = tabGroup.querySelector("[data-tab-nav]") as HTMLElement | null;
    const tabsContent = tabGroup.querySelector("[data-tab-content]") as HTMLElement | null;

    if (!tabsNav || !tabsContent) return;

    tabsNav.querySelectorAll("[data-tab]").forEach(tabNavItem => tabNavItem.classList.remove("active"));
    tabsContent.querySelectorAll("[data-tab-panel]").forEach(tabPane => tabPane.classList.remove("active"));

    const activeTab = tabsNav.querySelector(`[data-tab="${tabName}"]`);
    const activePanel = tabsContent.querySelector(`[data-tab-panel="${tabName}"]`);

    if (activeTab) activeTab.classList.add("active");
    if (activePanel) activePanel.classList.add("active");
  }

  // Counter
  private initCounter(): void {
    document.querySelectorAll(".counter .count").forEach(count => {
      this.animateCounter(count as HTMLElement, 500);
    });
  }

  private animateCounter(el: HTMLElement, duration: number): void {
    const endValue = Number(el.innerText.replace(/\D/gi, ""));
    const text = el.innerText.replace(/\W|\d/gi, "");
    const timeStep = Math.round(duration / endValue);
    let current = 0;
    const timer = setInterval(() => {
      current = current > endValue ? endValue : current + 1;
      el.innerText = current + text;
      if (current === endValue) clearInterval(timer);
    }, timeStep);
  }

  // Video Play Button
  private initVideoPlayer(): void {
    if (this.videoPlayBtn) {
      this.videoPlayBtn.nativeElement.addEventListener("click", () => {
        this.videoPlayer.nativeElement.classList.remove("hidden");
      });
    }
  }

  // Accordion
  private initAccordion(): void {
    const accordions = document.querySelectorAll("[data-accordion]");
    accordions.forEach(header => {
      header.addEventListener("click", () => {
        header.parentElement?.classList.toggle("active");
      });
    });
  }

  // Shuffle.js for Filtering
  private initShuffle(): void {
    const tabItems = document.querySelector(".integration-tab-items") as HTMLElement | null;
    if (!tabItems) return;

    const myShuffle = new Shuffle(tabItems, {
      itemSelector: ".integration-tab-item",
      sizer: ".integration-tab-item",
      buffer: 1
    });

    document.querySelectorAll(".integration-tab .filter-btn").forEach(tabItem => {
      tabItem.addEventListener("click", e => {
        e.preventDefault();
        const filterValue = tabItem.getAttribute("data-group") || undefined;
        document.querySelectorAll(".integration-tab .filter-btn").forEach(link => link.classList.remove("filter-btn-active"));
        tabItem.classList.add("filter-btn-active");
        myShuffle.filter(filterValue);
      });
    });
  }
}
