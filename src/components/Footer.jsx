import { Heart, Camera, MessageCircle, Globe, Video, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Safety', href: '#safety' },
      { name: 'Premium', href: '#' },
      { name: 'Download', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    legal: [
      { name: 'Terms of Usage', href: '/terms' },
      { name: 'Clean App Usage', href: '/clean-usage' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Security', href: '#' },
    ]
  };

  if (new URLSearchParams(window.location.search).get('minimal') === 'true') {
    return null;
  }

  return (
    <footer className="bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
              <img src="logo-full.png" alt="LoveMitra Logo" className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              Making real connections easier and safer for everyone. Join our community of over 10 million people finding meaningful relationships.
            </p>
            <div className="flex gap-4">
              {[Camera, MessageCircle, Globe, Video].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-primary-start hover:shadow-md transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-500 hover:text-primary-start transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-500 hover:text-primary-start transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-500 hover:text-primary-start transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            © {currentYear} LoveMitra. All rights reserved. Made with <Heart className="inline text-primary-start" size={14} fill="currentColor" /> by Rahul.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">English (US)</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
