import { useEffect, useRef } from 'react';

export function useDraggable(ref) {
    const isDragging = useRef(false);
    const initialX = useRef(0);
    const initialY = useRef(0);
    const currentX = useRef(0);
    const currentY = useRef(0);

    useEffect(() => {
        const element = ref.current;

        function dragStart(e) {
            isDragging.current = true;
            initialX.current = e.clientX - currentX.current;
            initialY.current = e.clientY - currentY.current;
        }

        function dragEnd() {
            isDragging.current = false;
            initialX.current = currentX.current;
            initialY.current = currentY.current;
        }

        function drag(e) {
            if (isDragging.current) {
                e.preventDefault();
                currentX.current = e.clientX - initialX.current;
                currentY.current = e.clientY - initialY.current;
                element.style.transform = `translate(${currentX.current}px, ${currentY.current}px)`;
            }
        }

        if (element) {
            element.addEventListener('mousedown', dragStart);
            element.addEventListener('mouseup', dragEnd);
            element.addEventListener('mousemove', drag);

            return () => {
                element.removeEventListener('mousedown', dragStart);
                element.removeEventListener('mouseup', dragEnd);
                element.removeEventListener('mousemove', drag);
            };
        }
    }, [ref]);

    return ref;
}


// const draggableRef = useRef(null);

// useDraggable(draggableRef)

// const [lock, setLock] = useState(false)
// const containerRef = lock? null : draggableRef;
// { lock?
//   <p className='lock pointer' onClick={() => setLock(false)}>Un-lock</p>:
//   <p className='lock pointer' onClick={() => setLock(true)}>Lock</p>
//  }
