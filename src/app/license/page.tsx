'use client'

import { motion } from 'framer-motion'

export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-8">License Information</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold mb-4">Non-Commercial License with Attribution</h2>
          
          <p className="text-muted-foreground mb-6">
            Copyright (c) 2025 J&S Group, LLC
          </p>

          <div className="space-y-6 text-muted-foreground">
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
              and associated documentation files (the "Software"), to use, copy, modify, merge, and distribute 
              the Software for non-commercial purposes only, subject to the following conditions:
            </p>

            <ol className="list-decimal list-inside space-y-4 pl-4">
              <li>
                The above copyright notice, this permission notice, and the below attribution notice shall 
                be included in all copies or substantial portions of the Software.
              </li>
              <li>
                <strong>Attribution:</strong> This software was created by J&S Group, LLC. Any use, modification, 
                or distribution of this software must maintain this attribution.
              </li>
              <li>
                <strong>Non-Commercial Use:</strong> The Software may not be used for commercial purposes. 
                Commercial purposes means using the Software for direct or indirect commercial advantage 
                or monetary compensation.
              </li>
              <li>
                <strong>Derivative Works:</strong> Any modifications or derivative works based on the Software 
                must also be distributed under these same terms and conditions.
              </li>
              <li>
                <strong>No Warranty:</strong> The Software is provided "as is", without warranty of any kind, 
                express or implied, including but not limited to the warranties of merchantability, fitness 
                for a particular purpose and noninfringement.
              </li>
              <li>
                <strong>Limitation of Liability:</strong> In no event shall J&S Group, LLC or the authors 
                be liable for any claim, damages or other liability, whether in an action of contract, tort 
                or otherwise, arising from, out of or in connection with the Software or the use or other 
                dealings in the Software.
              </li>
            </ol>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="font-medium">
                For commercial licensing opportunities, please contact J&S Group, LLC.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}