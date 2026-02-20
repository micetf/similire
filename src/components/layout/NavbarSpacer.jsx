/**
 * Espaceur compensant la hauteur de la navbar fixe (h-14 = 56px).
 * À placer immédiatement après <Navbar /> dans le flux du document.
 *
 * @module components/layout/NavbarSpacer
 */

/**
 * Div d'espacement pour la navbar fixe.
 *
 * @returns {JSX.Element}
 */
function NavbarSpacer() {
    return <div className="h-14" aria-hidden="true" />;
}

export default NavbarSpacer;
