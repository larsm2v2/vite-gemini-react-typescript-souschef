import React, { useEffect, useCallback } from "react"
import { RecipeModel } from "../Models/Models"
import "./Navbar.css"
import "../Sidebar/Sidebar.css"

interface NavbarProps {
	sidebarToggled: boolean
	setSidebarToggled: React.Dispatch<React.SetStateAction<boolean>>
	setActiveContent: React.Dispatch<
		React.SetStateAction<"recipes" | "sousChef">
	>
	setRecipeToDisplay: React.Dispatch<React.SetStateAction<RecipeModel | null>>
}

const Navbar: React.FC<NavbarProps> = ({
	sidebarToggled,
	setSidebarToggled,
	setActiveContent,
	setRecipeToDisplay,
}: NavbarProps) => {
	const togglesidebar = () => {
		setSidebarToggled((prevState) => !prevState)
	}

	const navOpenClose = useCallback(
		(openNav: () => void, closeNav: () => void) => {
			if (sidebarToggled) {
				openNav()
			} else {
				closeNav()
			}
		},
		[sidebarToggled]
	)

	useEffect(() => {
		// Call navOpenClose after sidebarToggled has updated and the component re-renders
		navOpenClose(openNav, closeNav)
		// Add `console.log` here to see the updated state value
	}, [sidebarToggled, navOpenClose]) // This useEffect depends on sidebarToggled

	function openNav() {
		const sidebarWidth: string = "50vw"
		const sidebarWidthSmall: string = "80vw"
		const sidebar = document.getElementById("App-sidebar")
		if (sidebar) {
			sidebar.style.width = sidebarWidth
			const navbar = document.getElementById("App-navbar")
			if (navbar) {
				const navbarHeight = navbar.offsetHeight
				document.documentElement.style.setProperty(
					"--navbar-height",
					`${navbarHeight}px`
				)
			}

			if (window.innerWidth <= 480) {
				sidebar.style.width = sidebarWidthSmall
			}
			sidebar.classList.add("open")
		}
	}

	function closeNav() {
		const sidebar = document.getElementById("App-sidebar")
		if (sidebar) {
			sidebar.classList.remove("open")
		}
	}

	return (
		<nav className={"nav"}>
			<ul>
				<li
					onClick={() => {
						setActiveContent("recipes")
						setRecipeToDisplay(null)
					}}
				>
					myRecipes
				</li>
				<li
					onClick={() => {
						setActiveContent("sousChef")
						setRecipeToDisplay(null)
					}}
				>
					mySousChef
				</li>
				<li onClick={togglesidebar}>myShoppingList</li>
			</ul>
		</nav>
	)
}

export default Navbar
