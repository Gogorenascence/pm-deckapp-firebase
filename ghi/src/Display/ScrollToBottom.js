const ScrollToBottom = () => {
    const handleLoad = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        const scrollPosition = documentHeight - windowHeight;

        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    };

    // Attach the load event listener to trigger scroll once images are loaded
    window.addEventListener('load', handleLoad);

    // Clean up the event listener on component unmount
    return () => {
        window.removeEventListener('load', handleLoad);
    };
};

export default ScrollToBottom
