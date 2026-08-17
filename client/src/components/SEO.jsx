import { useEffect } from 'react';

const SEO = ({
  title = 'AI StudyMate',
  description = 'AI-powered student learning assistant for quizzes, flashcards, document summaries, and personalized study recommendations.',
  path = '',
}) => {
  const siteName = 'AI StudyMate';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', `https://aistudymate.app${path}`, true);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
  }, [fullTitle, description, path]);

  return null;
};

export default SEO;
