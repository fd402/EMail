import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Text,
    ImageIcon,
    Square,
    Minus,
} from 'lucide-react';

export const SlashCommandList = forwardRef((props: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.command(item);
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }

            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }

            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }

            return false;
        },
    }));

    return (
        <div className="items-center gap-2 rounded-md border border-gray-200 bg-white p-1 shadow-xl text-black">
            {props.items.length ? (
                props.items.map((item: any, index: number) => {
                    const Icon = getIcon(item.icon);
                    return (
                        <button
                            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100 ${index === selectedIndex ? 'bg-gray-200' : 'bg-transparent'
                                }`}
                            key={index}
                            onClick={() => selectItem(index)}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
                                {Icon && <Icon className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                        </button>
                    );
                })
            ) : (
                <div className="p-2 text-sm text-gray-500">No result</div>
            )}
        </div>
    );
});

SlashCommandList.displayName = 'SlashCommandList';

function getIcon(iconName: string) {
    switch (iconName) {
        case 'Heading1':
            return Heading1;
        case 'Heading2':
            return Heading2;
        case 'Heading3':
            return Heading3;
        case 'List':
            return List;
        case 'ListOrdered':
            return ListOrdered;
        case 'Text':
            return Text;
        case 'Image':
            return ImageIcon;
        case 'Button':
            return Square;
        case 'Divider':
            return Minus;
        default:
            return null;
    }
}

export default SlashCommandList;
