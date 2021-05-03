import React from "react";
import "./footer.css";

import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { MdFingerprint } from "react-icons/md";

function Footer() {
  return (
    <div className="footer-container">
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              CALIP
            </Link>
          </div>
          <small className="website-rights">Calip © 2021</small>
          <div className="social-icons">
            <Link
              className="social-icon-link"
              to="/"
              target="_blank"
              aria-label="Facebook"
            >
              <FaFacebook />
            </Link>
            <Link
              className="social-icon-link"
              to="/"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram />
            </Link>
            <Link
              className="social-icon-link"
              to={"/"}
              target="_blank"
              aria-label="Youtube"
            >
              <FaYoutube />
            </Link>
            <Link
              className="social-icon-link"
              to="/"
              target="_blank"
              aria-label="Twitter"
            >
              <FaTwitter />
            </Link>
            {/* <Link
              className='social-icon-link'
              to='//'
              target='_blank'
              aria-label='LinkedIn'
            > */}
            <a href="https://www.linkedin.com/company/calip/" target="_blank">
              <FaLinkedin />
            </a>
            {/* </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
