import { Modal, ModalProps } from '@mantine/core';

interface AppModalProps extends ModalProps {
    children: React.ReactNode;
}

const AppModal = ({
    children,
    opened,
    onClose,
    size = '70%',
    withCloseButton = false,
    overlayProps = {
        backgroundOpacity: 0.35,
        blur: 3,
    },
    styles = {},
    ...rest
}: AppModalProps) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size={size}
            title={rest.title}
            withCloseButton={withCloseButton}
            overlayProps={overlayProps}
            centered
            styles={{
                title: {
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'gray',
                    margin: 'auto',
                    marginBlock: '1rem'
                },
                ...styles,
            }}
            {...rest}
        >
            {children}
        </Modal>
    );
};

export default AppModal;
