export default function NewsletterForm() {
return (
Stay Updated

      <h2 style={styles.title}>
        Get market insights and platform updates
      </h2>
      <p style={styles.text}>
        Join our mailing list to receive research updates, insights,
        and important platform news from SlipMint.
      </p>
    </div>
    {/* BREVO EMBED FORM */}
    <div style={styles.iframeWrapper}>
      <iframe
        width="100%"
        height="520"
        src="https://771fe90d.sibforms.com/v2/serve/MUIFAFCMwgaUEJAahap8qNcHyo_rhIVk470-0zAtJZRuQJpCqyWCI0Tb_-9ss3564lh0f5RAz0iwGF1SLAC8ZIvJnxbC1HVU_4qWMbzkMaAH6_t38mvmLnLt8tml0qTpsFDaIgzm5iTx4Hfv6Ya_uLc6LBTrs5HppdjhGWtMQSSnA_cSwXFwAwhgOLINdHpVk2hMouO6TnKVJv_tdA=="
        frameBorder="0"
        scrolling="auto"
        allowFullScreen
        style={styles.iframe}
        title="SlipMint Newsletter Signup"
      />
    </div>
  </div>
</section>

)
}

const styles = {
section: {
maxWidth: ‘1180px’,
margin: ‘0 auto’,
padding: ‘20px’,
},

card: {
background: ‘linear-gradient(135deg, #13243a 0%, #0c1626 100%)’,
border: ‘1px solid rgba(34, 197, 94, 0.18)’,
borderRadius: ‘24px’,
padding: ‘32px 24px’,
color: ‘#ffffff’,
},

textWrap: {
maxWidth: ‘720px’,
marginBottom: ‘20px’,
},

tag: {
display: ‘inline-block’,
color: ‘#22c55e’,
fontWeight: 700,
fontSize: ‘14px’,
marginBottom: ‘10px’,
},

title: {
margin: ‘0 0 12px’,
fontSize: ‘30px’,
lineHeight: 1.2,
},

text: {
margin: 0,
color: ‘#b8c7d9’,
fontSize: ‘16px’,
lineHeight: 1.7,
},

iframeWrapper: {
width: ‘100%’,
marginTop: ‘20px’,
borderRadius: ‘16px’,
overflow: ‘hidden’,
},

iframe: {
width: ‘100%’,
border: ‘none’,
display: ‘block’,
background: ‘transparent’,
},
}