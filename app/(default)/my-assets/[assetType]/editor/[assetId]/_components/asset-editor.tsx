
interface AssetEditorProps {
    assetType: string,
    assetId: string
}

const AssetEditor: React.FC<AssetEditorProps> = (props) => {
    console.log('AssetEditor', props);
    return <div
        className="mt-4"
    >AssetEditor</div>
};

export default AssetEditor;