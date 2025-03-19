import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";

export function getNavbarState() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("navbarState") === "open";
    }
    return false;
  }
  
  export function toggleNavbar(isNavbarOpen: Signal<boolean>) {
    const newState = !isNavbarOpen.value;
    isNavbarOpen.value = newState;
  
    document.documentElement.style.setProperty(
      "--header-side-width-desktop",
      newState ? "300px" : "76px"
    );
  
    if (typeof window !== "undefined") {
      localStorage.setItem("navbarState", newState ? "open" : "closed");
    }
  }
  
  export async function signOut() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        console.error("Logout failed:", errorMsg);
        alert("Logout failed: " + errorMsg);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  