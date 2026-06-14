import styles from '../styles/SubscribeForm.module.css';

export default function SubscribeForm() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Stay Updated</h1>

      <h2 className={styles.heading}>
        Get market insights and platform updates
      </h2>

      <p className={styles.subtext}>
        Join our mailing list to receive research updates, insights, and important
        platform news from SlipMint.
      </p>

      <iframe
        width="540"
        height="305"
        src="https://771fe90d.sibforms.com/v2/serve/MUIFAFCMwgaUEJAahap8qNcHyo_rhIVk470-0zAtJZRuQJpCqyWCI0Tb_-9ss3564lh0f5RAz0iwGF1SLAC8ZIvJnxbC1HVU_4qWMbzkMaAH6_t38mvmLnLt8tml0qTpsFDaIgzm5iTx4Hfv6Ya_uLc6LBTrs5HppdjhGWtMQSSnA_cSwXFwAwhgOLINdHpVk2hMouO6TnKVJv_tdA=="
        frameBorder="0"
        scrolling="auto"
        allowFullScreen
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          maxWidth: '540px',
          minHeight: '305px',
          border: 'none'
        }}
      />
    </section>
  );
}