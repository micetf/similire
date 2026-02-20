/**
 * Navbar MiCetF pour SiMiLire.
 * Convertie depuis le HTML de Lecture Flash — structure et classes identiques.
 * Gère le menu mobile via useState.
 *
 * @module components/layout/Navbar
 */

import PropTypes from "prop-types";
import { useState, useCallback } from "react";

/**
 * Navbar fixe MiCetF.
 *
 * @returns {JSX.Element}
 */
function Navbar({ onAide }) {
    const [menuOuvert, setMenuOuvert] = useState(false);

    const handleContact = useCallback(() => {
        window.location.href =
            "mailto:webmaster@micetf.fr?subject=Au sujet de SiMiLire";
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
            <div className="max-w-full px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo MiCetF */}
                    <a
                        href="https://micetf.fr"
                        className="text-white font-semibold text-lg
                                   hover:text-gray-300 transition-colors"
                        title="Retour à l'accueil MiCetF"
                    >
                        MiCetF
                    </a>

                    {/* Bouton menu mobile */}
                    <button
                        type="button"
                        onClick={() => setMenuOuvert((v) => !v)}
                        className="md:hidden inline-flex items-center justify-center
                                   p-2 text-gray-400 hover:text-white
                                   hover:bg-gray-700 rounded transition-colors"
                        aria-controls="navbarToggle"
                        aria-expanded={menuOuvert}
                        aria-label="Ouvrir le menu"
                    >
                        {menuOuvert ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>

                    {/* Navigation desktop */}
                    <div className="hidden md:flex md:items-center md:flex-1">
                        {/* Titre de l'application */}
                        <div className="flex items-center ml-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-4 w-4 mr-1"
                                fill="#f8f9fa"
                                aria-hidden="true"
                            >
                                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                            </svg>
                            <span className="text-white font-semibold text-lg">
                                SiMiLire
                            </span>
                        </div>

                        <div className="flex-1" />

                        {/* Actions */}
                        <ul className="flex items-center space-x-2">
                            {/* Bouton aide */}
                            <li>
                                <button
                                    type="button"
                                    onClick={onAide}
                                    title="Aide pédagogique"
                                    className="flex items-center justify-center w-9 h-9
                   bg-blue-600 text-white 
                    rounded-full 
                    hover:bg-blue-700 
                    transition-colors duration-200
                    font-bold text-lg
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:ring-offset-2
                    shadow-md
                    hover:shadow-lg"
                                    aria-label="Ouvrir l'aide pédagogique"
                                >
                                    ?
                                </button>
                            </li>

                            {/* Don PayPal */}
                            <li>
                                <form
                                    action="https://www.paypal.com/cgi-bin/webscr"
                                    method="post"
                                    target="_top"
                                >
                                    <button
                                        type="submit"
                                        title="Si vous pensez que ces outils le méritent... Merci !"
                                        className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600
                                                   text-white rounded transition-colors my-1 mx-1"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            className="h-4 w-4"
                                            fill="#f8f9fa"
                                            aria-hidden="true"
                                        >
                                            <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
                                        </svg>
                                        <span className="sr-only">
                                            Faire un don
                                        </span>
                                    </button>
                                    <input
                                        type="hidden"
                                        name="cmd"
                                        value="_s-xclick"
                                    />
                                    <input
                                        type="hidden"
                                        name="hosted_button_id"
                                        value="Q2XYVFP4EEX2J"
                                    />
                                </form>
                            </li>

                            {/* Contact */}
                            <li>
                                <button
                                    type="button"
                                    onClick={handleContact}
                                    title="Contacter le webmaster"
                                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700
                                               text-white rounded transition-colors my-1 mx-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        className="h-4 w-4"
                                        fill="#f8f9fa"
                                        aria-hidden="true"
                                    >
                                        <path d="M18 2a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" />
                                    </svg>
                                    <span className="sr-only">
                                        Contacter le webmaster
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Menu mobile déroulant */}
                {menuOuvert && (
                    <div
                        id="navbarToggle"
                        className="md:hidden py-3 border-t border-gray-700 space-y-2"
                    >
                        <div className="flex items-center px-2 py-1 text-white font-semibold">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-4 w-4 mr-1"
                                fill="#f8f9fa"
                                aria-hidden="true"
                            >
                                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                            </svg>
                            SiMiLire
                        </div>
                        <button
                            type="button"
                            onClick={onAide}
                            className="flex items-center gap-2 px-3 py-2
               bg-gray-600 hover:bg-gray-500
               text-white rounded transition-colors"
                        >
                            <span className="font-bold text-sm">?</span>
                            <span className="text-sm">Aide</span>
                        </button>
                        <div className="flex gap-2 px-2">
                            {/* Don PayPal mobile */}
                            <form
                                action="https://www.paypal.com/cgi-bin/webscr"
                                method="post"
                                target="_top"
                            >
                                <button
                                    type="submit"
                                    title="Faire un don"
                                    className="flex items-center gap-2 px-3 py-2
                                               bg-yellow-500 hover:bg-yellow-600
                                               text-white rounded transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        className="h-4 w-4"
                                        fill="#f8f9fa"
                                        aria-hidden="true"
                                    >
                                        <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
                                    </svg>
                                    <span className="text-sm">
                                        Faire un don
                                    </span>
                                </button>
                                <input
                                    type="hidden"
                                    name="cmd"
                                    value="_s-xclick"
                                />
                                <input
                                    type="hidden"
                                    name="hosted_button_id"
                                    value="Q2XYVFP4EEX2J"
                                />
                            </form>

                            {/* Contact mobile */}
                            <button
                                type="button"
                                onClick={handleContact}
                                className="flex items-center gap-2 px-3 py-2
                                           bg-gray-600 hover:bg-gray-700
                                           text-white rounded transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-4 w-4"
                                    fill="#f8f9fa"
                                    aria-hidden="true"
                                >
                                    <path d="M18 2a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" />
                                </svg>
                                <span className="text-sm">Contact</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    onAide: PropTypes.func.isRequired,
};

export default Navbar;
