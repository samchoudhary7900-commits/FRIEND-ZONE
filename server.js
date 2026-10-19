<style>
    /* Dark Neon WePlay Theme CSS */
    #room-screen {
        display: none;
        background: radial-gradient(circle at center, #2e1065 0%, #0f0728 100%);
        border-radius: 20px;
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        border: 1px solid rgba(168, 85, 247, 0.4);
        margin-top: 5px;
        position: relative;
        overflow: hidden;
    }
    .room-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 12px; }
    
    /* Seat Grid - WePlay Style Layout */
    .seat-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        text-align: center;
        margin: 15px 0;
    }
    .seat { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
    .seat-circle {
        width: 50px; height: 50px; border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        border: 2px dashed rgba(168, 85, 247, 0.5);
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; color: #a855f7;
        box-shadow: inset 0 0 10px rgba(168, 85, 247, 0.2);
    }
    .seat-circle.occupied {
        background: linear-gradient(135deg, #a855f7, #ec4899);
        border: 2px solid #34d399;
        color: #fff;
        box-shadow: 0 0 15px rgba(236, 72, 153, 0.6);
    }
    .seat-name { font-size: 10px; color: #e9d5ff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 55px; }
</style>
            
