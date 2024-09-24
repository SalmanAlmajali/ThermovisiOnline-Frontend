import Link from 'next/link'
import React from 'react'

const BreadCrumbs = ({ items, ...props }) => {
    return (
        <div className="flex gap-2 items-start mb-4 p-2 bg-slate-300 rounded-md">
            {items?.map((crumb, i) => {
                const isLastItem = i === items.length - 1
                if (!isLastItem) {
                    return (
                        <div key={i}>
                            <Link
                                href={crumb?.url}
                                key={i}
                                className="text-indigo-500 hover:text-indigo-400 hover:underline">
                                {crumb?.text}
                            </Link>
                            {/* separator */}
                            <span> / </span>
                        </div>
                    )
                } else {
                    return crumb?.text
                }
            })}
        </div>
    )
}

export default BreadCrumbs
