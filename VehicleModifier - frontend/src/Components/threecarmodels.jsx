import { memo, useMemo, useState } from "react";
import Carmodels from "./carmodels";

const Threecarmodels = () => {
    const [linkmodel, setLink] = useState(null);

    const handlelink = (urllink) => {
        setLink(urllink);
    };

    const links = ["/car.glb", "/toy.glb"];

    // Use useMemo to memoize the list of links
    const memoizedLinks = useMemo(() => links, [links]);

    return (
        <>
            <div className="flex items-center justify-center mt-10">
                <h1 className="text-xl">3D</h1>
            </div>
            <div className="flex items-center justify-center">
                {memoizedLinks.map((link) => (
                    <Carmodels key={link} link={link} handlelink={handlelink}></Carmodels>
                ))}
            </div>
        </>
    );
};

export default memo(Threecarmodels);
