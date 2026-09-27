import React from 'react'

function DosageHeader() {


    return (
        <>
            {/*Header part*/}
            <div className="bg-white border-b border-zinc-200 px-8 pt-2">
                <h1 className="text-2xl font-bold text-zinc-800 mb-1">
                    Water Analysis &amp; Dosage Recommendation
                </h1>
                <p className="text-sm text-zinc-500 mb-4">
                    Analyze raw water quality and review the recommended coagulant dose.
                </p>
            </div>
        </>
    )
}

export default DosageHeader