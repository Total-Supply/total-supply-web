import { Button } from '@/src/components/ui/button'
import { CheckCircle2, Download, Image as ImageIcon } from 'lucide-react'

type DeliveryProof = {
  photoUrl: string
  deliveredAt: string
  driver?: {
    id: number
    name: string
  } | null
}

type DeliveryProofProps = {
  proof: DeliveryProof
  onImageClick: (imageUrl: string) => void
  className?: string
}

export function DeliveryProof({
  proof,
  onImageClick,
  className = '',
}: DeliveryProofProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Delivery Proof</h3>
          <p className="text-xs text-muted-foreground">
            Delivered on{' '}
            {new Date(proof.deliveredAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
            {proof.driver?.name && ` by ${proof.driver.name}`}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Image */}
        <div
          className="group relative rounded-xl overflow-hidden border border-border/60 cursor-pointer hover:opacity-90 transition-all duration-300 hover:shadow-lg"
          onClick={() => onImageClick(proof.photoUrl)}
        >
          <img
            src={proof.photoUrl}
            alt="Delivery proof"
            className="w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <ImageIcon className="h-6 w-6 text-foreground" />
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-3 right-3">
            <div className="rounded-full bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              <CheckCircle2 className="h-3 w-3 inline mr-1.5" />
              Verified Delivery
            </div>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={proof.photoUrl}
          download={`delivery-proof-${new Date(proof.deliveredAt).getTime()}.jpg`}
          className="inline-block w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="outline" size="sm" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Photo
          </Button>
        </a>
      </div>
    </div>
  )
}
